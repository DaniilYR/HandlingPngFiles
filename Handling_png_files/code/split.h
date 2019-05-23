#ifndef SPLIT_H
#define SPLIT_H

#include <QDialog>
#include <QMessageBox>
#include <QColorDialog>

namespace Ui {
class Split;
}

class Split : public QDialog
{
    Q_OBJECT

public:
    explicit Split(QWidget *parent = nullptr);
    ~Split();

signals:
    void cut(int, int, int, QColor);

private slots:
    void on_pushButton_clicked();

private:
    Ui::Split *ui;
};

#endif // SPLIT_H
