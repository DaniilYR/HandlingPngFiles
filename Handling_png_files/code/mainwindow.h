#ifndef MAINWINDOW_H
#define MAINWINDOW_H

#include <QMainWindow>
#include <QPainter>
#include <QRectF>
#include <QDebug>
#include <QColorDialog>
#include <QMenuBar>
#include <QFileDialog>
#include <QMessageBox>
#include <QGraphicsScene>
#include <QGraphicsView>
#include <QPixmap>
#include <map>
#include <QPushButton>
#include <QAction>
#include <QToolButton>
#include <QtGui>
#include <QColorDialog>
#include <QColor>
#include <QVector>
#include <iostream>

#include "QPen"
#include "mygraphicview.h"
#include "image.h"
#include "dialog.h"
#include "split.h"
#include "draws.h"
#include "info.h"
#include "help.h"
#include "r.h"

namespace Ui {
class MainWindow;
}

class MainWindow : public QMainWindow
{
    Q_OBJECT

public:
    explicit MainWindow(QWidget *parent = nullptr);
    ~MainWindow();
     Image *image;
     int flag = 0;
     Dialog *dialog;
     Split *split;
     draws *d;
     r *pr;
     MyGraphicView *picture;
     MyGraphicView *p;
     info *inform;
     help *help_p;
     QGraphicsScene *scene;
     QAction *newact;

private slots:
    void open_file();
    void save_file();
    void exit();
    void RGB();
    void slash();
    void draw_ss();
    void ds();
    void helping();
    void information();
    void Change(Channel ch, int n);
    void division(int kx, int ky, int w, QColor color);
    void r_r();
    void red_draw();
    void neg();

private:
    Ui::MainWindow *ui;
    QPushButton *add_button;
    QPushButton *save_button;
    QPushButton *exit_button;
    QPushButton *rgb_button;
    QPushButton *div_button;
    QPushButton *draw_square_button;
    QPushButton *draw_circle_button;
    QPushButton *rotate_button;
    QPushButton *white_area_button;
    QPushButton *negativ_button;
    QPushButton *inf;
    QPushButton *h;
};

#endif // MAINWINDOW_H
