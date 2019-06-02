#ifndef MYGRAPHICVIEW_H
#define MYGRAPHICVIEW_H

#include <QWidget>
#include <QGraphicsView>
#include <QGraphicsScene>
#include <QGraphicsItemGroup>
#include <QGridLayout>
#include <QLayout>
#include <QColor>
#include <QMouseEvent>
#include <QCursor>

struct Coordinate{
    int x1=0;
    int y1=0;
    int x2=0;
    int y2=0;
};

class MyGraphicView : public QGraphicsView
{
    Q_OBJECT

public:

    explicit MyGraphicView(QWidget* parent = nullptr);
    ~MyGraphicView();
    QColor color;
    void update(QPixmap pixmap);
    void mouseReleaseEvent(QMouseEvent *event);
    void mousePressEvent(QMouseEvent *event);
    void mouseMoveEvent(QMouseEvent *event);
    struct Coordinate coordinate;

signals:
    void point();

private:


    QGraphicsScene      *scene;
    QGraphicsItemGroup  *group;
    QPixmap             pixmap;
    void deleteItemsFromGroup(QGraphicsItemGroup* group1);

};

#endif // MYGRAPHICVIEW_H
