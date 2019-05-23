#include "dialog.h"
#include "ui_dialog.h"


Dialog::Dialog(QWidget *parent) :
    QDialog(parent),
    ui(new Ui::Dialog)
{
    ui->setupUi(this);
}

Dialog::~Dialog()
{
    delete ui;
}

void Dialog::on_pushButton_clicked()
{
    Channel ch;
    if(ui->red->isChecked())
        ch = red;
    if(ui->green->isChecked())
        ch = green;
    if(ui->blue->isChecked())
        ch = blue;

    emit replacement(ch, (ui->radioButton->isChecked()) ? 0 : 255);
    hide();
}
