// @ts-nocheck
import { EyeOutlined, StopOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  Descriptions,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useEffect, useMemo, useState } from 'react';
import { cancelBooking, getBookings } from '../../services/storage';
import { formatDate, formatVND } from '../../utils/formatters';
import type { Booking } from '../../types';

const { Title } = Typography;

export function ManageBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [detailBooking, setDetailBooking] = useState<Booking | null>(null);

  const refresh = () => setBookings(getBookings());
  useEffect(() => refresh(), []);

  const filtered = useMemo(
    () => (statusFilter === 'all' ? bookings : bookings.filter((b) => b.status === statusFilter)),
    [bookings, statusFilter]
  );

  const handleCancel = (id: string) => {
    cancelBooking(id);
    refresh();
  };

  const columns: ColumnsType<Booking> = [
    {
      title: 'Mã vé',
      dataIndex: 'bookingCode',
      key: 'bookingCode',
      render: (v) => <code className="text-yellow-400">{v}</code>,
    },
    { title: 'Khách hàng', dataIndex: 'customerName', key: 'customerName' },
    { title: 'SĐT', dataIndex: 'customerPhone', key: 'customerPhone' },
    { title: 'Phim', dataIndex: 'movieTitle', key: 'movieTitle', ellipsis: true },
    {
      title: 'Suất chiếu',
      key: 'showtime',
      render: (_, r) => `${formatDate(r.date)} • ${r.time}`,
    },
    {
      title: 'Ghế',
      dataIndex: 'seats',
      key: 'seats',
      render: (seats: string[]) => <Tag color="geekblue">{seats.join(', ')}</Tag>,
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (v) => <span className="text-yellow-400 font-bold">{formatVND(v)}</span>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (s: string) =>
        s === 'confirmed' ? (
          <Tag color="green">Đã đặt</Tag>
        ) : (
          <Tag color="red">Đã huỷ</Tag>
        ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, r) => (
        <Space>
          <Button size="small" icon={<EyeOutlined />} onClick={() => setDetailBooking(r)} />
          {r.status === 'confirmed' && (
            <Popconfirm
              title="Huỷ vé này? Ghế sẽ được trả về."
              onConfirm={() => handleCancel(r.id)}
              okText="Huỷ vé"
              cancelText="Không"
              okButtonProps={{ danger: true }}
            >
              <Button size="small" danger icon={<StopOutlined />} />
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Title level={3} style={{ color: '#e5e2e1', margin: 0 }}>
          Quản lý Đặt Vé
        </Title>
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          style={{ width: 160 }}
          options={[
            { value: 'all', label: 'Tất cả' },
            { value: 'confirmed', label: 'Đã đặt' },
            { value: 'cancelled', label: 'Đã huỷ' },
          ]}
        />
      </div>

      <Card style={{ background: '#1c1b1b', border: '1px solid rgba(255,255,255,0.06)' }}>
        <Table
          dataSource={filtered}
          columns={columns}
          rowKey="id"
          size="small"
          pagination={{ pageSize: 15 }}
        />
      </Card>

      {/* Detail Modal */}
      <Modal
        title="Chi tiết đặt vé"
        open={!!detailBooking}
        onCancel={() => setDetailBooking(null)}
        footer={null}
        width={540}
      >
        {detailBooking && (
          <Descriptions column={2} bordered size="small" style={{ marginTop: 16 }}>
            <Descriptions.Item label="Mã vé" span={2}>
              <code>{detailBooking.bookingCode}</code>
            </Descriptions.Item>
            <Descriptions.Item label="Khách hàng" span={2}>
              {detailBooking.customerName}
            </Descriptions.Item>
            <Descriptions.Item label="SĐT">{detailBooking.customerPhone}</Descriptions.Item>
            <Descriptions.Item label="Email">{detailBooking.customerEmail ?? '—'}</Descriptions.Item>
            <Descriptions.Item label="Phim" span={2}>
              {detailBooking.movieTitle}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày">{formatDate(detailBooking.date)}</Descriptions.Item>
            <Descriptions.Item label="Giờ">{detailBooking.time}</Descriptions.Item>
            <Descriptions.Item label="Ghế" span={2}>
              <Tag color="geekblue">{detailBooking.seats.join(', ')}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Tổng tiền" span={2}>
              <span style={{ color: '#e9c400', fontWeight: 700 }}>
                {formatVND(detailBooking.totalAmount)}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái" span={2}>
              {detailBooking.status === 'confirmed' ? (
                <Tag color="green">Đã đặt</Tag>
              ) : (
                <Tag color="red">Đã huỷ</Tag>
              )}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
}
