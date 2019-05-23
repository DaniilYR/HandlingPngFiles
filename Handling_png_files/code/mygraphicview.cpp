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
