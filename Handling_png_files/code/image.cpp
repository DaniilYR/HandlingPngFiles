#include "image.h"

int Image::open_png_file(const char *file_name){
    png_uint_32 x,y;
    png_byte header[8]= {0};

    FILE *fp = fopen(file_name, "rb");
    if (!fp){
      return -1;
    }

    fread(header, 1, 8, fp);
    if (png_sig_cmp(header, 0, 8)!=0) {
      return -1;
    }

    /* initialize stuff */
    Bitmap.png_ptr = png_create_read_struct(PNG_LIBPNG_VER_STRING, nullptr, nullptr, nullptr);

    if (!Bitmap.png_ptr){
      return -1;
    }

    Bitmap.info_ptr = png_create_info_struct(Bitmap.png_ptr);
    if (!Bitmap.info_ptr){
      return -1;
    }

    if (setjmp(png_jmpbuf(Bitmap.png_ptr))){
      return -1;
    }

    png_init_io(Bitmap.png_ptr, fp);
    png_set_sig_bytes(Bitmap.png_ptr, 8);

    png_read_info(Bitmap.png_ptr, Bitmap.info_ptr);

    Bitmap.width = png_get_image_width(Bitmap.png_ptr, Bitmap.info_ptr);
    Bitmap.height = png_get_image_height(Bitmap.png_ptr, Bitmap.info_ptr);
    Bitmap.color_type = png_get_color_type(Bitmap.png_ptr, Bitmap.info_ptr);
    Bitmap.bit_depth = png_get_bit_depth(Bitmap.png_ptr, Bitmap.info_ptr);
    Bitmap.number_of_passes = png_set_interlace_handling(Bitmap.png_ptr);

    // png формат может содержать 16 бит на канал, но нам нужно только 8, поэтому сужаем канал
    if (Bitmap.bit_depth == 16) png_set_strip_16(Bitmap.png_ptr);
    // преобразуем файл если он содержит палитру в нормальный RGB
    if (Bitmap.color_type == PNG_COLOR_TYPE_PALETTE && Bitmap.bit_depth <= 8) png_set_palette_to_rgb(Bitmap.png_ptr);
    //image->color_type=2;   // RGB with palette->RGB
    // если в грэйскейле меньше бит на канал чем 8, то конвертим к нормальному 8-битному
    if (Bitmap.color_type == PNG_COLOR_TYPE_GRAY && Bitmap.bit_depth < 8) png_set_expand_gray_1_2_4_to_8(Bitmap.png_ptr);
    // и добавляем полный альфа-канал
    if (png_get_valid(Bitmap.png_ptr, Bitmap.info_ptr, PNG_INFO_tRNS)) png_set_tRNS_to_alpha(Bitmap.png_ptr);

    // These color_type don't have an alpha channel then fill it with 0xff.
    if(Bitmap.color_type == PNG_COLOR_TYPE_RGB ||
       Bitmap.color_type == PNG_COLOR_TYPE_GRAY||
       Bitmap.color_type == PNG_COLOR_TYPE_PALETTE)
        png_set_filler(Bitmap.png_ptr,0xFF, PNG_FILLER_AFTER);

    if (Bitmap.color_type == PNG_COLOR_TYPE_GRAY || Bitmap.color_type == PNG_COLOR_TYPE_GRAY_ALPHA)
      png_set_gray_to_rgb(Bitmap.png_ptr);



    png_read_update_info(Bitmap.png_ptr, Bitmap.info_ptr);

    Bitmap.width = png_get_image_width(Bitmap.png_ptr, Bitmap.info_ptr);
    Bitmap.height = png_get_image_height(Bitmap.png_ptr, Bitmap.info_ptr);
    Bitmap.color_type = png_get_color_type(Bitmap.png_ptr, Bitmap.info_ptr);
    Bitmap.bit_depth = png_get_bit_depth(Bitmap.png_ptr, Bitmap.info_ptr);
    Bitmap.number_of_passes = png_set_interlace_handling(Bitmap.png_ptr);
    Bitmap.color_type=6;

    /* read file */
    if (setjmp(png_jmpbuf(Bitmap.png_ptr))){
      return -1;
    }

    Bitmap.row_pointers = static_cast <png_byte**> (malloc(sizeof(png_byte *) * Bitmap.height));
    for (y = 0; y < Bitmap.height; y++){
        Bitmap.row_pointers[Bitmap.height-y-1] = static_cast<png_byte*> (malloc(png_get_rowbytes(Bitmap.png_ptr, Bitmap.info_ptr)));
    }
    png_read_image(Bitmap.png_ptr, Bitmap.row_pointers);

    Bitmap.Pixels = static_cast<Pixel_t**>(malloc(sizeof(Pixel_t *) * Bitmap.height));
        for (png_uint_32 i = 0; i < Bitmap.height; i++) {
            Bitmap.Pixels[i] = static_cast<Pixel_t*>(calloc(sizeof(Pixel_t), Bitmap.width));
        }
        for(y = 0; y < Bitmap.height; y++){
            for(x = 0; x < Bitmap.width; x++){
                png_byte *px = &Bitmap.row_pointers[y][x * 4];
                Bitmap.Pixels[y][x].red = uint8_t(px[0]);
                Bitmap.Pixels[y][x].green = uint8_t(px[1]);
                Bitmap.Pixels[y][x].blue = uint8_t(px[2]);
                Bitmap.Pixels[y][x].alpha = uint8_t(px[3]);
            }
        }

    fclose(fp);
    return 0;
}

int Image::save_png_file(const char *file_name){
    png_uint_32 y,x;
    FILE *fp = fopen(file_name, "wb");
    if (!fp){
        return -1;
    }

    /* initialize stuff */
    Bitmap.png_ptr = png_create_write_struct(PNG_LIBPNG_VER_STRING, nullptr, nullptr, nullptr);

    if (!Bitmap.png_ptr){
        return -1;
    }

    Bitmap.info_ptr = png_create_info_struct(Bitmap.png_ptr);
    if (!Bitmap.info_ptr){
        return -1;
    }

    if (setjmp(png_jmpbuf(Bitmap.png_ptr))){
        return -1;

    }

    png_init_io(Bitmap.png_ptr, fp);


    /* write header */
    if (setjmp(png_jmpbuf(Bitmap.png_ptr))){
        return -1;
    }

    png_set_IHDR(Bitmap.png_ptr, Bitmap.info_ptr, Bitmap.width, Bitmap.height,
                 Bitmap.bit_depth, PNG_COLOR_TYPE_RGBA, PNG_INTERLACE_NONE,
                 PNG_COMPRESSION_TYPE_BASE, PNG_FILTER_TYPE_BASE);

    png_write_info(Bitmap.png_ptr, Bitmap.info_ptr);

    if (setjmp(png_jmpbuf(Bitmap.png_ptr))){
        return -1;
    }

    for(y=0;y<Bitmap.height;y++){
        for (x=0;x<Bitmap.width;x++) {
            png_byte *px = &Bitmap.row_pointers[y][x * 4];
            px[0] = png_byte(Bitmap.Pixels[y][x].red);
            px[1] = png_byte(Bitmap.Pixels[y][x].green);
            px[2] = png_byte(Bitmap.Pixels[y][x].blue);
            px[3] = png_byte(Bitmap.Pixels[y][x].alpha);
        }
    }


    /* write bytes */


    png_write_image(Bitmap.png_ptr, Bitmap.row_pointers);


    /* end write */
    if (setjmp(png_jmpbuf(Bitmap.png_ptr))){
        cout <<"error during end of write\n";
        return -1;
    }

    png_write_end(Bitmap.png_ptr, nullptr);

    /* cleanup heap allocation */

    for (y = 0; y < Bitmap.height-1; y++)
        free(Bitmap.row_pointers[y]);
    free(Bitmap.row_pointers);

    fclose(fp);
    return 0;
}

void Image::draw_c(float x1, float y1, float x2, float y2, float w, QColor color, QColor color_z)
{
    if(abs(x1-x2) > abs(y1-y2))
        y2 = y1 + abs(x1-x2);
    if(abs(x1-x2) < abs(y1-y2))
        x2 = x1 + abs(y1-y2);
    float xc = abs(x1-x2)/2 + x1;
    float yc = abs(y1-y2)/2 + y1;
    float r = abs(x1-x2)/2;
    float dn = 1/r;
    int x,y;
    float n = 0;
    while (n < 2*3.14159265358979323846)
    {
        x = round(xc + r*cos(n));
        y = round(yc + r*sin(n));
        for(int t = x; t < x+w; t++)
            for(int d = y; d < y+w; d++)
            {
                Bitmap.Pixels[d][t].red = uint8_t(color.red());
                Bitmap.Pixels[d][t].green = uint8_t(color.green());
                Bitmap.Pixels[d][t].blue = uint8_t(color.blue());

            }
        n += dn;
    }

    if(color_z.name() != "#000000")
    {
        // 2 quarter
        for(int x = x1; x < x1+r; x++)
            for(int y = y1; y < y1+r; y++)
                if((x-xc-w+1)*(x-xc-w+1)+(y-yc-w+1)*(y-yc-w+1) - (r)*(r) < 1)
                {
                    Bitmap.Pixels[y][x].red = uint8_t(color_z.red());
                    Bitmap.Pixels[y][x].green = uint8_t(color_z.green());
                    Bitmap.Pixels[y][x].blue = uint8_t(color_z.blue());
                }
        // 4 quarter
        for(int x = x1+r; x < x2; x++)
            for(int y = y1+r; y < y2; y++)
                if((x-xc)*(x-xc)+(y-yc)*(y-yc) - (r)*(r) < 1)
                {
                    Bitmap.Pixels[y][x].red = uint8_t(color_z.red());
                    Bitmap.Pixels[y][x].green = uint8_t(color_z.green());
                    Bitmap.Pixels[y][x].blue = uint8_t(color_z.blue());
                }
        // 1 quarter
        for(int x = x1+r; x < x2; x++)
            for(int y = y1; y < y1+r; y++)
                if((x-xc)*(x-xc)+(y-yc-w+1)*(y-yc-w+1) - (r)*(r) < 1)
                {
                    Bitmap.Pixels[y][x].red = uint8_t(color_z.red());
                    Bitmap.Pixels[y][x].green = uint8_t(color_z.green());
                    Bitmap.Pixels[y][x].blue = uint8_t(color_z.blue());
                }
        // 3 quarter
        for(int x = x1; x < x1+r; x++)
            for(int y = y1+r; y < y2; y++)
                if((x-xc-w+1)*(x-xc-w+1)+(y-yc)*(y-yc) - (r)*(r) < 1)
                {
                    Bitmap.Pixels[y][x].red = uint8_t(color_z.red());
                    Bitmap.Pixels[y][x].green = uint8_t(color_z.green());
                    Bitmap.Pixels[y][x].blue = uint8_t(color_z.blue());
                }
    }
}

void Image::draw_s(int x1, int y1, int x2, int y2, int w, QColor color, QColor color_z)
{
    if(abs(x1-x2) > abs(y1-y2))
        y2 = y1 + abs(x1-x2);
    if(abs(x1-x2) < abs(y1-y2))
        x2 = x1 + abs(y1-y2);
    //horizont lines
    for(int x = x1; x <= x2; x++)
    {
        for(int y = y1; y <= y1+w; y++)
        {
            Bitmap.Pixels[y][x].red = uint8_t(color.red());
            Bitmap.Pixels[y][x].green = uint8_t(color.green());
            Bitmap.Pixels[y][x].blue = uint8_t(color.blue());
        }
        for(int y = y2; y >= y2-w; y--)
        {
            Bitmap.Pixels[y][x].red = uint8_t(color.red());
            Bitmap.Pixels[y][x].green = uint8_t(color.green());
            Bitmap.Pixels[y][x].blue = uint8_t(color.blue());
        }
    }
    //vertical lines
    for(int y = y1; y <= y2; y++)
    {
        for(int x = x1; x <= x1+w; x++)
        {
            Bitmap.Pixels[y][x].red = uint8_t(color.red());
            Bitmap.Pixels[y][x].green = uint8_t(color.green());
            Bitmap.Pixels[y][x].blue = uint8_t(color.blue());
        }
        for(int x = x2; x >= x2-w; x--)
        {
            Bitmap.Pixels[y][x].red = uint8_t(color.red());
            Bitmap.Pixels[y][x].green = uint8_t(color.green());
            Bitmap.Pixels[y][x].blue = uint8_t(color.blue());
        }
    }

    if(color_z.name() != "#000000")
    {
        for(int x = x1+w+1; x < x2-w; x++)
            for(int y = y1+w+1; y < y2-w; y++)
            {
                Bitmap.Pixels[y][x].red = uint8_t(color_z.red());
                Bitmap.Pixels[y][x].green = uint8_t(color_z.green());
                Bitmap.Pixels[y][x].blue = uint8_t(color_z.blue());
            }
    }

    //diagonal from upper left corner
    for(int x = x1, y = y1; x < x2-w, y < y2-w; x++, y++)
    {
        for(int t = x; t < x+w; t++)
            for(int d = y; d < y+w; d++)
            {
                Bitmap.Pixels[d][t].red = uint8_t(color.red());
                Bitmap.Pixels[d][t].green = uint8_t(color.green());
                Bitmap.Pixels[d][t].blue = uint8_t(color.blue());
            }
    }

    //diagonal from upper right corner
    for(int x = x2-w, y = y1; x > x1-w, y < y2-w; x--, y++)
    {
        for(int t = x; t < x+w; t++)
            for(int d = y; d < y+w; d++)
            {
                Bitmap.Pixels[d][t].red = uint8_t(color.red());
                Bitmap.Pixels[d][t].green = uint8_t(color.green());
                Bitmap.Pixels[d][t].blue = uint8_t(color.blue());
            }
    }
}

QPixmap Image::get_pixmap()
{
    QImage *image = new QImage(Bitmap.width, Bitmap.height, QImage::Format_RGB16);
    QColor color;
    for (png_uint_32 y = 0; y < Bitmap.height; y++) {
        for (png_uint_32 x = 0; x < Bitmap.width; x++) {
            color.setRed(Bitmap.Pixels[y][x].red);
            color.setGreen(Bitmap.Pixels[y][x].green);
            color.setBlue(Bitmap.Pixels[y][x].blue);
            image->setPixel(x, y, color.rgba());
        }
    }
    return QPixmap::fromImage(*image);
}

int Image::rotate(int x1,int y1, int x2, int y2, int angle){

    Pixel_t **Pixels2 = static_cast<Pixel_t **>(malloc(sizeof(Pixel_t *) * Bitmap.height));
    for (png_uint_32 i = 0; i < Bitmap.height; i++)
    {
        Pixels2[i] = static_cast<Pixel_t*>(calloc(sizeof(Pixel_t), Bitmap.width));
    }

    for (png_uint_32 y = 0; y < Bitmap.height; y++)
    {
        for (png_uint_32 x = 0; x < Bitmap.width; x++)
        {
            Pixels2[y][x] = Bitmap.Pixels[y][x];
        }
    }

    if(angle == 90)
    {
        int mid_x = x2-(x2-x1)/2;
        int mid_y = y2-(y2-y1)/2;
        int lenx = x2 - x1;
        int leny = y2 - y1;
        Pixel_t **tmp = static_cast<Pixel_t **>(malloc(sizeof(Pixel_t *)*lenx));
        for (png_uint_32 i = 0; i < lenx; i++)
        {
            tmp[i] = static_cast<Pixel_t*>(calloc(sizeof(Pixel_t), leny));
        }

        for (int y = 0; y < leny; y++)
        {
            for (int x = 0; x < lenx; x++)
            {
                tmp[x][leny-1-y] = Pixels2[y+y1][x+x1];
            }
        }

        for (int y = y1; y < y2; y++)
        {
            for (int x = x1; x < x2; x++)
            {
                Pixels2[y][x].red = 255;
                Pixels2[y][x].green = 255;
                Pixels2[y][x].blue = 255;
            }
        }

        for (int y = 0; y < lenx; y++)
        {
            for (int x = 0; x < leny; x++)
            {
                if(mid_y-lenx/2+y >= 0 && mid_y-lenx/2+y < Bitmap.height && mid_x-leny/2+x >= 0 && mid_x-leny/2+x < Bitmap.width)
                {
                    Pixels2[mid_y-lenx/2+y][mid_x-leny/2+x] = tmp[y][x];
                }
            }
        }
        for (int i = 0; i < lenx; i++)
        {
            free(tmp[i]);
        }
        free(tmp);

    }

    if(angle == 270)
    {
        int mid_x = x2-(x2-x1)/2;
        int mid_y = y2-(y2-y1)/2;
        int lenx = x2-x1;
        int leny = y2-y1;
        Pixel_t **tmp = static_cast<Pixel_t **>(malloc(sizeof(Pixel_t *)*lenx));
        for (int i = 0; i < lenx; i++)
        {
            tmp[i] = static_cast<Pixel_t*>(calloc(sizeof(Pixel_t), leny));
        }

        for (int y = 0; y < leny; y++)
        {
            for (int x = 0; x < lenx; x++)
            {
                tmp[x][y] = Pixels2[y+y1][x+x1];
            }
        }

        for (int y = y1; y < y2; y++)
        {
            for (int x = x1; x < x2; x++)
            {
                Pixels2[y][x].red=255;
                Pixels2[y][x].green=255;
                Pixels2[y][x].blue=255;
            }
        }

        for (int y = 0; y < lenx; y++)
        {
            for (int x = 0; x < leny; x++)
            {
                if(mid_y-lenx/2+y >= 0 && mid_y-lenx/2+y < Bitmap.height && mid_x-leny/2+x >= 0 && mid_x-leny/2+x < Bitmap.width)
                {
                    Pixels2[mid_y-lenx/2+y][mid_x-leny/2+x] = tmp[y][x];
                }
            }
        }
        for (int i = 0; i < lenx; i++)
        {
            free(tmp[i]);
        }
        free(tmp);

    }

    if(angle == 180)
    {

        for (int y = y1; y < y2; y++)
        {
            for (int x = x1; x < x2; x++)
            {
                Pixels2[y1+y2-y][x1+x2-x] = Bitmap.Pixels[y][x];
            }
        }
    }

    /*if(angle == 360)
    {

        for (int y = y1; y < y2; y++)
        {
            for (int x = x1; x < x2; x++)
            {
                Pixels2[y][x1+x2-x] = Bitmap.Pixels[y][x];
            }
        }
    }*/


    Pixel_t **Pixels1 = Bitmap.Pixels;
    Bitmap.Pixels = Pixels2;

    for(int y = 0; y < Bitmap.height; y++)
    {
        free(Pixels1[y]);
    }
    free(Pixels1);
    return 0;
}

void Image::negativ_RGB(int x1, int y1, int x2, int y2){

    /*if (x2 < x1)
        std::swap(x1, x2);
    if (y2 < y1)
        std::swap(y1, y2);*/

    for (int y = y1; y < y2; y++) {
        for (int x = x1; x < x2; x++) {
            Bitmap.Pixels[y][x].red = 255 - Bitmap.Pixels[y][x].red;
            Bitmap.Pixels[y][x].green= 255 - Bitmap.Pixels[y][x].green;
            Bitmap.Pixels[y][x].blue= 255 - Bitmap.Pixels[y][x].blue;

        }
    }
}
