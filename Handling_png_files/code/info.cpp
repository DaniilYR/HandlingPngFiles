#include "info.h"
#include "ui_info.h"

info::info(QWidget *parent) :
    QDialog(parent),
    ui(new Ui::info)
{
    ui->setupUi(this);
}

info::~info()
{
    delete ui;
}

void info::set_info(QString name, QString file_papth, QString Type, int color_type, bool isReadable, bool isWritable, int width, int height, qint64 size){
    ui->name->setText(name);
    ui->path->setText(file_papth);
    isReadable? ui->read->setText("Да"): ui->read->setText("Нет");
    isWritable? ui->write->setText("Да"): ui->write->setText("Нет");
    ui->width_p->setNum(width);
    ui->heigth_p->setNum(height);
    ui->size->setNum(int(size)/8);
    QString CT;
    switch (color_type){
    case 0 :
        CT="grey";
        break;
    case 2:
        CT="RGB";
        break;
    case 3:
        CT="RGB + palette";
        break;
    case 4:
        CT="grey + a";
        break;
    case 6:
        CT="RGBA";
        break;
    }
    ui->c_type->setText(CT);
    ui->i_type->setText(Type);
}
