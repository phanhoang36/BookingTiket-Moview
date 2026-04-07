// @ts-nocheck
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Space,
  Table,
  Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { deleteHall, getHalls, saveHall } from '../../services/storage';
import { getRowLabel } from '../../utils/formatters';
import type { Hall } from '../../types';
import { cn } from '../../lib/utils';

const { Title } = Typography;

function HallPreview({ hall }: { hall: Partial<Hall> }) {
  const rows = hall.rows ?? 4;
  const cols = hall.cols ?? 6;
  const layout = hall.seatLayout ?? {};
  return (
    <div className="mt-4 flex flex-col items-center gap-1.5">
      <div className="h-1 w-3/4 bg-white/30 rounded-full mb-2" />
      {Array.from({ length: rows }, (_, ri) => (
        <div key={ri} className="flex gap-1">
          {Array.from({ length: cols }, (_, ci) => {
            const seatId = `${getRowLabel(ri)}${ci + 1}`;
            const type = layout[seatId] ?? 'standard';
            return (
              <div
                key={ci}
                className={cn(
                  'w-4 h-4 rounded-sm',
                  type === 'vip' && 'bg-yellow-400',
                  type === 'couple' && 'bg-red-400',
                  type === 'standard' && 'bg-gray-500'
                )}
              />
            );
          })}
        </div>
      ))}
      <p className="text-[10px] text-gray-400 mt-1">Preview ({rows}hàng × {cols}cột)</p>
    </div>
  );
}

export function ManageHalls() {
  const [halls, setHalls] = useState<Hall[]>([]);
  const [open, setOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Hall | null>(null);
  const [form] = Form.useForm();
  const [preview, setPreview] = useState<Partial<Hall>>({ rows: 8, cols: 10 });

  const refresh = () => setHalls(getHalls());
  useEffect(() => refresh(), []);

  const openCreate = () => {
    setEditTarget(null);
    form.resetFields();
    setPreview({ rows: 8, cols: 10, seatLayout: {} });
    setOpen(true);
  };

  const openEdit = (h: Hall) => {
    setEditTarget(h);
    form.setFieldsValue({ name: h.name, rows: h.rows, cols: h.cols });
    setPreview(h);
    setOpen(true);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      const hall: Hall = {
        id: editTarget?.id ?? uuidv4(),
        name: values.name,
        rows: values.rows,
        cols: values.cols,
        seatLayout: editTarget?.seatLayout ?? {},
      };
      saveHall(hall);
      refresh();
      setOpen(false);
    });
  };

  const handleDelete = (id: string) => {
    deleteHall(id);
    refresh();
  };

  const columns: ColumnsType<Hall> = [
    { title: 'Tên phòng', dataIndex: 'name', key: 'name' },
    {
      title: 'Kích thước',
      key: 'size',
      render: (_, r) => `${r.rows} hàng × ${r.cols} cột = ${r.rows * r.cols} ghế`,
    },
    {
      title: 'VIP',
      key: 'vip',
      render: (_, r) => Object.values(r.seatLayout).filter((t) => t === 'vip').length,
    },
    {
      title: 'Đôi',
      key: 'couple',
      render: (_, r) => Object.values(r.seatLayout).filter((t) => t === 'couple').length,
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, r) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(r)} />
          <Popconfirm
            title="Xoá phòng chiếu này?"
            onConfirm={() => handleDelete(r.id)}
            okText="Xoá"
            cancelText="Huỷ"
          >
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Title level={3} style={{ color: '#e5e2e1', margin: 0 }}>
          Quản lý Phòng Chiếu
        </Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          Thêm phòng
        </Button>
      </div>

      <Card style={{ background: '#1c1b1b', border: '1px solid rgba(255,255,255,0.06)' }}>
        <Table dataSource={halls} columns={columns} rowKey="id" size="small" />
      </Card>

      <Modal
        title={editTarget ? 'Sửa phòng chiếu' : 'Thêm phòng chiếu'}
        open={open}
        onOk={handleOk}
        onCancel={() => setOpen(false)}
        okText="Lưu"
        cancelText="Huỷ"
        width={480}
      >
        <Form
          form={form}
          layout="vertical"
          style={{ marginTop: 16 }}
          onValuesChange={(_, all) =>
            setPreview({
              rows: all.rows ?? 8,
              cols: all.cols ?? 10,
              seatLayout: editTarget?.seatLayout ?? {},
            })
          }
        >
          <Form.Item
            label="Tên phòng"
            name="name"
            rules={[{ required: true, message: 'Nhập tên phòng' }]}
          >
            <Input placeholder="VD: Phòng 1 – IMAX" />
          </Form.Item>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item label="Số hàng" name="rows" rules={[{ required: true }]} initialValue={8}>
              <InputNumber min={4} max={20} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label="Số cột" name="cols" rules={[{ required: true }]} initialValue={10}>
              <InputNumber min={6} max={20} style={{ width: '100%' }} />
            </Form.Item>
          </div>
        </Form>

        <HallPreview hall={preview} />
      </Modal>
    </div>
  );
}
