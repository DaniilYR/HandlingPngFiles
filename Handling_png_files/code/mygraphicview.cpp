#include "mygraphicview.h"

MyGraphicView::MyGraphicView(QWidget *parent) :
    QGraphicsView(parent)
{
    this->setAlignment(Qt::AlignLeft | Qt::AlignTop);
    group = new QGraphicsItemGroup();
}

void MyGraphicView::mousePressEvent(QMouseEvent* event)
{
    coordinate.x1 = this->mapFromGlobal(QCursor::pos()).x();
    coordinate.y1 = this->mapFromGlobal(QCursor::pos()).y();
}

void MyGraphicView::mouseReleaseEvent(QMouseEvent* event)
{
    coordinate.x2 = this->mapFromGlobal(QCursor::pos()).x();
    coordinate.y2 = this->mapFromGlobal(QCursor::pos()).y();
    this->deleteItemsFromGroup(group);
    emit point();
}

void MyGraphicView::mouseMoveEvent(QMouseEvent *event)
{
    //if (button_pressed == INVERSE || button_pressed == RECTANGLE || button_pressed == ROTATE)
    //{
        int x1 = coordinate.x1;
        int y1 = coordinate.y1;
        int x2 = this->mapFromGlobal(QCursor::pos()).x();
        int y2 = this->mapFromGlobal(QCursor::pos()).y();
        this->deleteItemsFromGroup(group);
        group = new QGraphicsItemGroup();

        color.setRed(255);
        color.setGreen(255);
        color.setBlue(255);

        if (x2 < 0)
            x2 = 0;
        if (y2 < 0)
            y2 = 0;
        if (x2 < x1)
            std::swap(x1, x2);

        if (y2 < y1)
            std::swap(y1, y2);
        int a = abs(x2-x1) > abs(y2-y1) ? abs(x2-x1) : abs(y2-y1);
        group->addToGroup((scene->addRect(x1, y1, x2 - x1, y2 - y1, color)));
        scene->addItem(group);
    //}
}

void MyGraphicView::update(QPixmap pixmap)
{
    scene = new QGraphicsScene();
    scene->addPixmap(pixmap);
    this->setScene(scene);
}

void MyGraphicView::deleteItemsFromGroup(QGraphicsItemGroup *group)
{
    for(QGraphicsItem *item: scene->items(group->boundingRect())) {
       if(item->group() == group)
          delete item;
    }
}

MyGraphicView::~MyGraphicView()
{

}
