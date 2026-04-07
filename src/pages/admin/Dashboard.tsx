// @ts-nocheck
import { CalendarOutlined, CheckCircleOutlined, DollarOutlined, TeamOutlined } from '@ant-design/icons';
import { Card, Statistic, Table, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { getBookings, getShowtimes } from '../../services/storage';
import { formatVND } from '../../utils/formatters';
import type { Booking, Showtime } from '../../types';

const { Title } = Typography;

export function Dashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const today = dayjs().format('YYYY-MM-DD');

  useEffect(() => {
    setBookings(getBookings());
    setShowtimes(getShowtimes());
  }, []);

  const confirmed = bookings.filter((b) => b.status === 'confirmed');
  const todayBookings = confirmed.filter((b) => b.date === today);
  const totalRevenue = confirmed.reduce((s, b) => s + b.totalAmount, 0);
  const activeShowtimes = showtimes.filter((s) => s.date >= today).length;

  const recentBookings = bookings.slice(0, 10);

  const columns: ColumnsType<Booking> = [
    { title: 'Mã vé', dataIndex: 'bookingCode', key: 'bookingCode', render: (v) => <code>{v}</code> },
    { title: 'Khách hàng', dataIndex: 'customerName', key: 'customerName' },
    { title: 'Phim', dataIndex: 'movieTitle', key: 'movieTitle', ellipsis: true },
    {
      title: 'Ngày',
      key: 'datetime',
      render: (_, r) => `${r.date} ${r.time}`,
    },
    {
      title: 'Ghế',
      dataIndex: 'seats',
      key: 'seats',
      render: (seats: string[]) => seats.join(', '),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (v) => formatVND(v),
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
  ];

  return (
    <div className="space-y-8">
      <Title level={3} style={{ color: '#e5e2e1', margin: 0 }}>
        Dashboard
      </Title>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card style={{ background: '#1c1b1b', border: '1px solid rgba(255,255,255,0.06)' }}>
          <Statistic
            title={<span style={{ color: '#e8bcb7' }}>Tổng đặt vé</span>}
            value={confirmed.length}
            prefix={<TeamOutlined />}
            valueStyle={{ color: '#ffb4ab' }}
          />
        </Card>
        <Card style={{ background: '#1c1b1b', border: '1px solid rgba(255,255,255,0.06)' }}>
          <Statistic
            title={<span style={{ color: '#e8bcb7' }}>Doanh thu</span>}
            value={totalRevenue}
            formatter={(v) => formatVND(Number(v))}
            prefix={<DollarOutlined />}
            valueStyle={{ color: '#e9c400' }}
          />
        </Card>
        <Card style={{ background: '#1c1b1b', border: '1px solid rgba(255,255,255,0.06)' }}>
          <Statistic
            title={<span style={{ color: '#e8bcb7' }}>Vé hôm nay</span>}
            value={todayBookings.length}
            prefix={<CheckCircleOutlined />}
            valueStyle={{ color: '#52c41a' }}
          />
        </Card>
        <Card style={{ background: '#1c1b1b', border: '1px solid rgba(255,255,255,0.06)' }}>
          <Statistic
            title={<span style={{ color: '#e8bcb7' }}>Suất đang chạy</span>}
            value={activeShowtimes}
            prefix={<CalendarOutlined />}
            valueStyle={{ color: '#1677ff' }}
          />
        </Card>
      </div>

      {/* Recent Bookings */}
      <Card
        title={<span style={{ color: '#e5e2e1' }}>Đặt vé gần đây</span>}
        style={{ background: '#1c1b1b', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <Table
          dataSource={recentBookings}
          columns={columns}
          rowKey="id"
          pagination={false}
          size="small"
          style={{ background: 'transparent' }}
        />
      </Card>
    </div>
  );
}
