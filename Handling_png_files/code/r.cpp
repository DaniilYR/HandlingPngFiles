#include "r.h"
#include "ui_r.h"

r::r(QWidget *parent) :
    QDialog(parent),
    ui(new Ui::r)
{
    ui->setupUi(this);
}

r::~r()
{
    delete ui;
}

void r::on_pushButton_clicked()
{
    if(ui->radioButton->isChecked())
    {
        check = 1;
        angle = 90;
    }
    if(ui->radioButton_2->isChecked())
    {
        check = 1;
        angle = 180;
    }
    if(ui->radioButton_3->isChecked())
    {
        check = 1;
        angle = 270;
    }
    if(ui->radioButton_4->isChecked())
    {
        check = 1;
        angle = 360;
    }
    hide();
}
