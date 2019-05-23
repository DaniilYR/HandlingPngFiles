#ifndef DRAWS_H
#define DRAWS_H

#include <QDialog>
#include <QColor>
#include <QColorDialog>

namespace Ui {
class draws;
}

class draws : public QDialog
{
    Q_OBJECT

public:
    explicit draws(QWidget *parent = nullptr);
    ~draws();
    int thick = 1;
    int f = 0;
    QColor color;
    QColor color_z;

signals:
    void dr(int, QColor, QColor);

private slots:
    void on_pushButton_clicked();

private:
    Ui::draws *ui;
};

#endif // DRAWS_H
