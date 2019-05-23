#include "draws.h"
#include "ui_draws.h"

draws::draws(QWidget *parent) :
    QDialog(parent),
    ui(new Ui::draws)
{
    ui->setupUi(this);
}

draws::~draws()
{
    delete ui;
}

void draws::on_pushButton_clicked()
{
    if(ui->radioButton_3->isChecked())
    {
        f = 1;
        QColor c;
        color_z = c;
        thick = ui->spinBox->text().toInt();
        color = QColorDialog::getColor(Qt::black, this, "Select the color of the SHAPE");
        if(ui->radioButton->isChecked())
            color_z = QColorDialog::getColor(Qt::black, this, "Select a FILL color");
    }
    else
    {
        f = 2;
        QColor c;
        color_z = c;
        thick = ui->spinBox->text().toInt();
        color = QColorDialog::getColor(Qt::black, this, "Select the color of the SHAPE");
        if(ui->radioButton->isChecked())
            color_z = QColorDialog::getColor(Qt::black, this, "Select a FILL color");
    }
    hide();
}
