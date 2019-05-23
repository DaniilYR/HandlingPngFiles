#include "split.h"
#include "ui_split.h"

Split::Split(QWidget *parent) :
    QDialog(parent),
    ui(new Ui::Split)
{
    ui->setupUi(this);
}

Split::~Split()
{
    delete ui;
}

void Split::on_pushButton_clicked()
{
    QString tx = "0";
    tx = ui->lineX->text();
    QString ty = "0";
    ty = ui->lineY->text();
    QString tw = ui->spinBox->text();
    if(tx.toInt() == 0 || ty.toInt() == 0)
    {
        QMessageBox::critical(this, "Error", "Enter a numberic value greater than 0");
        return;
    }
    QColor color = QColorDialog::getColor(Qt::black, this, "Select LINE color");
    emit cut(tx.toInt(), ty.toInt(), tw.toInt(), color);
    hide();
}
