#ifndef INFO_H
#define INFO_H

#include <QDialog>

namespace Ui {
class info;
}

class info : public QDialog
{
    Q_OBJECT

public:
    explicit info(QWidget *parent = nullptr);
    ~info();

public slots:
    void set_info(QString name, QString file_papth, QString Type, int color_type, bool isReadable, bool isWritable, int width, int height, qint64 size);

private:
    Ui::info *ui;
};

#endif // INFO_H
