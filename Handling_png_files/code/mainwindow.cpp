#include "mainwindow.h"
#include "ui_mainwindow.h"
#include <QDebug>

MainWindow::MainWindow(QWidget *parent) :
    QMainWindow(parent),
    ui(new Ui::MainWindow)
{
    ui->setupUi(this);
    image = new Image();
    picture = new MyGraphicView();
    inform = new info();
    help_p = new help();
    d = new draws();
    pr = new r();

    add_button = new QPushButton("New file", this);
    add_button->setGeometry(10, 30, 200, 30);
    connect(add_button, SIGNAL(clicked()), this, SLOT(open_file()));

    save_button = new QPushButton("Save file", this);
    save_button->setGeometry(10, 65, 200, 30);
    connect(save_button, SIGNAL(clicked()), this, SLOT(save_file()));

    h = new QPushButton("Help", this);
    h->setGeometry(10, 100, 200, 30);
    connect(h, SIGNAL(clicked()), this, SLOT(helping()));

    inf = new QPushButton("Information", this);
    inf->setGeometry(10, 137, 200, 30);
    connect(inf, SIGNAL(clicked()), this, SLOT(information()));

    exit_button = new QPushButton("Exit", this);
    exit_button->setGeometry(10, 170, 200, 30);
    connect(exit_button, SIGNAL(clicked()), this, SLOT(exit()));


    rgb_button = new QPushButton("RGB-component", this);
    rgb_button->setGeometry(10, 270, 200, 30);
    connect(rgb_button, SIGNAL(clicked()), this, SLOT(RGB()));

    div_button = new QPushButton("Division", this);
    div_button->setGeometry(10, 305, 200, 30);
    connect(div_button, SIGNAL(clicked()), this, SLOT(slash()));

    draw_square_button = new QPushButton("Drawing shapes", this);
    draw_square_button->setGeometry(10, 340, 200, 30);
    connect(draw_square_button, SIGNAL(clicked()), this, SLOT(draw_ss()));

    rotate_button = new QPushButton("Turn", this);
    rotate_button->setGeometry(10, 375, 200, 30);
    connect(rotate_button, SIGNAL(clicked()), this, SLOT(r_r()));

    white_area_button = new QPushButton("White area", this);
    white_area_button->setGeometry(10, 410, 200, 30);
    connect(white_area_button, SIGNAL(clicked()), this, SLOT(red_draw()));

    negativ_button = new QPushButton("Negativ", this);
    negativ_button->setGeometry(10, 445, 200, 30);
    connect(negativ_button, SIGNAL(clicked()), this, SLOT(neg()));

    connect(picture, SIGNAL(point()), this, SLOT(ds()));
}

MainWindow::~MainWindow()
{
    delete ui;
}

void MainWindow::helping()
{
    help_p->exec();
}

void MainWindow::red_draw()
{
    if(image->Bitmap.width == 0 && image->Bitmap.height == 0)
    {
        QMessageBox::critical(this, "Error", "Upload an image to use the tool");
        return;
    }
    png_uint_32 x, y;
    for(y = 1; y < image->Bitmap.height - 1; y++)
    {
        for (x = 1; x < image->Bitmap.width - 1; x++)
        {
            if(((image->Bitmap.Pixels[y][x].red == 255) &&
               (image->Bitmap.Pixels[y][x].green == 255) &&
               (image->Bitmap.Pixels[y][x].blue == 255)))
            {
                if(!((image->Bitmap.Pixels[y][x-1].red == 255) &&
                   (image->Bitmap.Pixels[y][x-1].green == 255) &&
                   (image->Bitmap.Pixels[y][x-1].blue == 255)))
                {
                    image->Bitmap.Pixels[y][x-1].red = 255;
                    image->Bitmap.Pixels[y][x-1].green = 0;
                    image->Bitmap.Pixels[y][x-1].blue = 0;
                }
                if(!((image->Bitmap.Pixels[y][x+1].red == 255) &&
                   (image->Bitmap.Pixels[y][x+1].green == 255) &&
                   (image->Bitmap.Pixels[y][x+1].blue == 255)))
                {
                    image->Bitmap.Pixels[y][x+1].red = 255;
                    image->Bitmap.Pixels[y][x+1].green = 0;
                    image->Bitmap.Pixels[y][x+1].blue = 0;
                }
                if(!((image->Bitmap.Pixels[y-1][x].red == 255) &&
                   (image->Bitmap.Pixels[y-1][x].green == 255) &&
                   (image->Bitmap.Pixels[y-1][x].blue == 255)))
                {
                    image->Bitmap.Pixels[y-1][x].red = 255;
                    image->Bitmap.Pixels[y-1][x].green = 0;
                    image->Bitmap.Pixels[y-1][x].blue = 0;
                }
                if(!((image->Bitmap.Pixels[y+1][x].red == 255) &&
                   (image->Bitmap.Pixels[y+1][x].green == 255) &&
                   (image->Bitmap.Pixels[y+1][x].blue == 255)))
                {
                    image->Bitmap.Pixels[y+1][x].red = 255;
                    image->Bitmap.Pixels[y+1][x].green = 0;
                    image->Bitmap.Pixels[y+1][x].blue = 0;
                }
            }
        }
    }
    picture->update(image->get_pixmap());
    ui->gridLayout->addWidget(picture);

}

void MainWindow::r_r()
{
    if(image->Bitmap.width == 0 && image->Bitmap.height == 0)
    {
        QMessageBox::critical(this, "Error", "Upload an image to use the tool");
        return;
    }
    pr->exec();
}

void MainWindow::information()
{
    inform->exec();
}

void MainWindow::neg()
{
    flag = 1;
}

void MainWindow::draw_ss()
{
    if(image->Bitmap.width == 0 && image->Bitmap.height == 0)
    {
        QMessageBox::critical(this, "Error", "Upload an image to use the tool");
        return;
    }
    d->exec();
}

void MainWindow::ds()
{
    int x1 = picture->coordinate.x1;
    int y1 = picture->coordinate.y1;
    int x2 = picture->coordinate.x2;
    int y2 = picture->coordinate.y2;
    if (picture->coordinate.x1 < 0 || picture->coordinate.x1 >= image->Bitmap.width ||
        picture->coordinate.x2 < 0 || picture->coordinate.x2 >= image->Bitmap.width ||
        picture->coordinate.y1 < 0 || picture->coordinate.y1 >= image->Bitmap.height ||
        picture->coordinate.y2 < 0 || picture->coordinate.y2 >= image->Bitmap.height)
        {
            QMessageBox::critical(this, "Error", "Scope not specified");
            return;
        }
    if(pr->check)
    {
        flag = 0;
        image->rotate(x1, y1, x2, y2, pr->angle);
        picture->update(image->get_pixmap());
        ui->gridLayout->addWidget(picture);
        pr->check = 0;
        return;
    }
    if(d->f == 1)
    {
         image->draw_c(x1, y1, x2, y2, d->thick, d->color, d->color_z);
         picture->update(image->get_pixmap());
         ui->gridLayout->addWidget(picture);
         d->f = 0;
         return;
    }
    if(d->f == 2)
    {
        image->draw_s(x1, y1, x2, y2, d->thick, d->color, d->color_z);
        picture->update(image->get_pixmap());
        ui->gridLayout->addWidget(picture);
        d->f = 0;
        return;
    }

    if(flag == 1)
    {
        image->negativ_RGB(x1, y1, x2, y2);
        picture->update(image->get_pixmap());
        ui->gridLayout->addWidget(picture);
        //flag = 0;
        return;
    }
}

void MainWindow::RGB()
{
    if(image->Bitmap.width == 0 && image->Bitmap.height == 0)
    {
        QMessageBox::critical(this, "Error", "Upload an image to use the tool");
        return;
    }
    dialog = new Dialog();
    connect(dialog, SIGNAL(replacement(Channel, int)), this, SLOT(Change(Channel, int)));
    dialog->exec();
    delete dialog;
}

void MainWindow::slash()
{
    if(image->Bitmap.width == 0 && image->Bitmap.height == 0)
    {
        QMessageBox::critical(this, "Error", "Upload an image to use the tool");
        return;
    }
    split = new Split();
    connect(split, SIGNAL(cut(int, int, int, QColor)), this, SLOT(division(int, int, int, QColor)));
    split->exec();
    delete  split;
}

void MainWindow::open_file()
{
    QString file_name = QFileDialog::getOpenFileName(this, "Select a file", "/home/dan/Qt/Proects", "*.png");
    if (file_name == nullptr){
        return;
    }
    if (image->open_png_file(file_name.toLocal8Bit().constData())){
        QMessageBox::critical(this, "Error", "Failed to open image");
    }
    if(image->Bitmap.color_type != 6){
        QMessageBox::critical(this, "", "IT`S NOT RGBA");
        return;
    }
    picture->update(image->get_pixmap());
    ui->gridLayout->addWidget(picture);
    inform->set_info(QFileInfo(file_name).baseName(),QFileInfo(file_name).filePath(),"PNG (.png)",image->Bitmap.color_type,QFileInfo(file_name).isReadable(),QFileInfo(file_name).isWritable(),
                       image->Bitmap.width,image->Bitmap.height,QFileInfo(file_name).size());
}

void MainWindow::save_file()
{
    QString save_name = QFileDialog::getSaveFileName(this, "Select a file", "/home/dan/Qt/Proects", "*.png");
        if(image->save_png_file(save_name.toLocal8Bit().constData())){
            QMessageBox::critical(this, "Error", "Failed to save image");
            return;
        }
}

void MainWindow::exit()
{
    QMessageBox::StandardButton reply = QMessageBox::question(this, "Exit", "Close the application?", QMessageBox::Yes | QMessageBox::No);
    if(reply==QMessageBox::Yes){
        QApplication::quit();
    }
}

void MainWindow::Change(Channel ch, int n)
{
    png_uint_32 x, y;
    for(y = 0; y < image->Bitmap.height; y++){
        for (x = 0; x < image->Bitmap.width; x++) {
            if(ch == red)
            {
                image->Bitmap.Pixels[y][x].red = n;
            }
            if(ch == green)
            {
                image->Bitmap.Pixels[y][x].green = n;
            }
            if(ch == blue)
            {
                image->Bitmap.Pixels[y][x].blue = n;
            }
        }
    }
    picture->update(image->get_pixmap());
    ui->gridLayout->addWidget(picture);
}

void MainWindow::division(int kx, int ky, int w, QColor color)
{
    //horizont lines
    int step_y = image->Bitmap.height / ky;
    for(png_uint_32 y = step_y; y <= (image->Bitmap.height - step_y); y+=step_y)
    {
        for(png_uint_32 t = y; t <= (y + w - 1); t++)
            for(png_uint_32 x = 0; x <= image->Bitmap.width; x++)
            {
                image->Bitmap.Pixels[t][x].red = uint8_t(color.red());
                image->Bitmap.Pixels[t][x].green = uint8_t(color.green());
                image->Bitmap.Pixels[t][x].blue = uint8_t(color.blue());
            }
    }

    //virtical lines
    int step_x = image->Bitmap.width / kx;
    for(png_uint_32 x = step_x; x <= (image->Bitmap.width - step_x); x+=step_x)
    {
        for(png_uint_32 t = x; t <= (x + w - 1); t++)
            for(png_uint_32 y = 0; y < image->Bitmap.height; y++)
            {
                image->Bitmap.Pixels[y][t].red = uint8_t(color.red());
                image->Bitmap.Pixels[y][t].green = uint8_t(color.green());
                image->Bitmap.Pixels[y][t].blue = uint8_t(color.blue());
            }
    }

    picture->update(image->get_pixmap());
    ui->gridLayout->addWidget(picture);
}

