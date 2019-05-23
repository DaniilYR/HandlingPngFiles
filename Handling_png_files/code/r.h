#ifndef R_H
#define R_H

#include <QDialog>

namespace Ui {
class r;
}

class r : public QDialog
{
    Q_OBJECT

public:
    explicit r(QWidget *parent = nullptr);
    ~r();
    int check = 0;
    int angle = 0;

private slots:
    void on_pushButton_clicked();

private:
    Ui::r *ui;
};

#endif // R_H
