// @ts-nocheck
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  TimePicker,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useSearchMovies } from "../../hooks/useTmdbMovies";
import {
  deleteShowtime,
  getBookings,
  getHalls,
  getShowtimes,
  saveShowtime,
} from "../../services/storage";
import { formatVND } from "../../utils/formatters";
import type { Showtime } from "../../types";

const { Title } = Typography;

export function ManageShowtimes() {
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [open, setOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Showtime | null>(null);
  const [movieSearch, setMovieSearch] = useState("");
  const [form] = Form.useForm();

  const halls = useMemo(() => getHalls(), []);
  const { data: searchResults, isFetching } = useSearchMovies(movieSearch);

  const refresh = () => setShowtimes(getShowtimes());
  useEffect(() => refresh(), []);

  const bookings = useMemo(() => getBookings(), []);
  const soldCount = (showtimeId: string) =>
    bookings.filter(
      (b) => b.showtimeId === showtimeId && b.status === "confirmed",
    ).length;

  const openCreate = () => {
    setEditTarget(null);
    form.resetFields();
    setMovieSearch("");
    setOpen(true);
  };

  const openEdit = (st: Showtime) => {
    setEditTarget(st);
    form.setFieldsValue({
      movieId: st.movieId,
      movieTitle: st.movieTitle,
      date: dayjs(st.date),
      time: dayjs(st.time, "HH:mm"),
      hallId: st.hallId,
      priceStandard: st.prices.standard,
      priceVip: st.prices.vip,
      priceCouple: st.prices.couple,
    });
    setOpen(true);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      const showtime: Showtime = {
        id: editTarget?.id ?? uuidv4(),
        movieId: values.movieId,
        movieTitle: values.movieTitle,
        moviePoster: values.moviePoster ?? "",
        date: dayjs(values.date).format("YYYY-MM-DD"),
        time: dayjs(values.time).format("HH:mm"),
        hallId: values.hallId,
        prices: {
          standard: values.priceStandard,
          vip: values.priceVip,
          couple: values.priceCouple,
        },
      };
      saveShowtime(showtime);
      refresh();
      setOpen(false);
    });
  };

  const handleDelete = (id: string) => {
    deleteShowtime(id);
    refresh();
  };

  const columns: ColumnsType<Showtime> = [
    {
      title: "Phim",
      dataIndex: "movieTitle",
      key: "movieTitle",
      ellipsis: true,
    },
    { title: "Ngày", dataIndex: "date", key: "date" },
    { title: "Giờ", dataIndex: "time", key: "time" },
    {
      title: "Phòng",
      dataIndex: "hallId",
      key: "hallId",
      render: (hid) => halls.find((h) => h.id === hid)?.name ?? hid,
    },
    {
      title: "Giá vé",
      key: "price",
      render: (_, r) => formatVND(r.prices.standard),
    },
    {
      title: "Đã bán",
      key: "sold",
      render: (_, r) => {
        const hall = halls.find((h) => h.id === r.hallId);
        const total = hall ? hall.rows * hall.cols : "?";
        return (
          <Tag color="blue">
            {soldCount(r.id)} / {total}
          </Tag>
        );
      },
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, r) => (
        <Space>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => openEdit(r)}
          />
          <Popconfirm
            title="Xoá suất chiếu này?"
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
        <Title level={3} style={{ color: "#e5e2e1", margin: 0 }}>
          Quản lý Suất Chiếu
        </Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          Thêm suất chiếu
        </Button>
      </div>

      <Card
        style={{
          background: "#1c1b1b",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <Table
          dataSource={showtimes}
          columns={columns}
          rowKey="id"
          size="small"
        />
      </Card>

      <Modal
        title={editTarget ? "Sửa suất chiếu" : "Thêm suất chiếu"}
        open={open}
        onOk={handleOk}
        onCancel={() => setOpen(false)}
        okText="Lưu"
        cancelText="Huỷ"
        width={560}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          {/* Movie Search */}
          <Form.Item label="Tìm phim (TMDB)" required>
            <Input
              prefix={<SearchOutlined />}
              placeholder="Nhập tên phim..."
              value={movieSearch}
              onChange={(e) => setMovieSearch(e.target.value)}
            />
          </Form.Item>

          {searchResults && searchResults.results.length > 0 && (
            <Form.Item
              label="Chọn phim"
              name="movieId"
              rules={[{ required: true, message: "Chọn phim" }]}
            >
              <Select
                showSearch
                loading={isFetching}
                placeholder="Chọn phim từ kết quả..."
                filterOption={false}
                onChange={(value) => {
                  const movie = searchResults.results.find(
                    (m) => m.id === value,
                  );
                  if (movie) {
                    form.setFieldValue("movieTitle", movie.title);
                    form.setFieldValue("moviePoster", movie.poster_path ?? "");
                  }
                }}
              >
                {searchResults.results.map((m) => (
                  <Select.Option key={m.id} value={m.id}>
                    {m.title} ({m.release_date?.slice(0, 4) ?? "N/A"})
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          )}

          <Form.Item name="movieTitle" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="moviePoster" hidden>
            <Input />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              label="Ngày chiếu"
              name="date"
              rules={[{ required: true }]}
            >
              <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
            </Form.Item>
            <Form.Item
              label="Giờ chiếu"
              name="time"
              rules={[{ required: true }]}
            >
              <TimePicker
                style={{ width: "100%" }}
                format="HH:mm"
                minuteStep={15}
              />
            </Form.Item>
          </div>

          <Form.Item
            label="Phòng chiếu"
            name="hallId"
            rules={[{ required: true }]}
          >
            <Select placeholder="Chọn phòng">
              {halls.map((h) => (
                <Select.Option key={h.id} value={h.id}>
                  {h.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <div className="grid grid-cols-3 gap-3">
            <Form.Item
              label="Giá thường (₫)"
              name="priceStandard"
              rules={[{ required: true }]}
              initialValue={90000}
            >
              <InputNumber min={0} step={10000} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              label="Giá VIP (₫)"
              name="priceVip"
              rules={[{ required: true }]}
              initialValue={130000}
            >
              <InputNumber min={0} step={10000} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              label="Giá đôi (₫)"
              name="priceCouple"
              rules={[{ required: true }]}
              initialValue={220000}
            >
              <InputNumber min={0} step={10000} style={{ width: "100%" }} />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
