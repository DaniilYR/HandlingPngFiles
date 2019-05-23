#ifndef IMAGE_H
#define IMAGE_H


#include <png.h>
#include <cstdint>
#include <iostream>
#include <cstring>
#include <cmath>
#include <QPixmap>
#include <QGraphicsView>
#include <QGraphicsScene>
#include <QGraphicsItemGroup>
#include <QColor>
#include <QDebug>
#include <QColorDialog>
#include <map>
#include <cmath>

#include "mygraphicview.h"

using namespace std;

class Image{

    typedef struct {
            uint8_t red;
            uint8_t green;
            uint8_t blue;
            uint8_t alpha;
        } Pixel_t;

    typedef struct Png{
        png_uint_32 width, height;
        int number_of_passes;
        png_byte color_type;
        png_byte bit_depth;

        png_infop info_ptr;
        png_structp png_ptr;
        png_byte **row_pointers;
        Pixel_t **Pixels;

    } Bitmap_t;

public:
    Bitmap_t Bitmap;
    int open_png_file(const char *file_name);
    int save_png_file(const char *file_name);
    void draw_s(int, int, int, int, int, QColor, QColor);
    void draw_c(float, float, float, float, float, QColor, QColor);
    int rotate(int, int, int, int, int);
    void negativ_RGB(int, int, int, int);
    QPixmap get_pixmap();
};
#endif // IMAGE_H
