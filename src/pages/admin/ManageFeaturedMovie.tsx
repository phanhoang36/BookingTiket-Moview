// @ts-nocheck
import { CheckCircleOutlined, ClearOutlined, SearchOutlined, StarFilled } from '@ant-design/icons';
import {
  Alert,
  Button,
  Card,
  Col,
  Empty,
  Input,
  Row,
  Spin,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import { useState } from 'react';
import { toast } from 'sonner';
import { TMDB_IMAGE } from '../../api/tmdb';
import { useSearchMovies } from '../../hooks/useTmdbMovies';
import { clearFeaturedMovie, getFeaturedMovie, setFeaturedMovie } from '../../services/storage';
import type { TmdbMovie } from '../../types';

const { Title, Text, Paragraph } = Typography;

export function ManageFeaturedMovie() {
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState('');
  const [featured, setFeatured] = useState<TmdbMovie | null>(() => getFeaturedMovie());

  const { data, isFetching } = useSearchMovies(search);

  const handleSelect = (movie: TmdbMovie) => {
    setFeaturedMovie(movie);
    setFeatured(movie);
    toast.success(`Đã đặt "${movie.title}" làm biểu ngữ trang chủ!`);
  };

  const handleReset = () => {
    clearFeaturedMovie();
    setFeatured(null);
    toast.success('Đã đặt lại về mặc định (phim đầu tiên từ TMDB Now Playing)');
  };

  const backdropUrl = featured ? TMDB_IMAGE(featured.backdrop_path, 'original') : null;
  const posterUrl = featured ? TMDB_IMAGE(featured.poster_path, 'w500') : null;

  return (
    <div style={{ padding: 24 }}>
      <Title level={3} style={{ marginBottom: 4 }}>
        Biểu ngữ trang chủ
      </Title>
      <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
        Chọn bộ phim hiển thị ở banner lớn (hero section) khi người dùng vào trang chủ.
      </Text>

      {/* ── Current banner preview ───────────────────────── */}
      <Card
        title="Đang hiển thị"
        extra={
          featured && (
            <Button danger icon={<ClearOutlined />} onClick={handleReset}>
              Đặt lại mặc định
            </Button>
          )
        }
        style={{ marginBottom: 24 }}
      >
        {featured ? (
          <>
            {/* Backdrop thumbnail */}
            <div
              style={{
                width: '100%',
                height: 240,
                borderRadius: 10,
                backgroundImage: backdropUrl ? `url('${backdropUrl}')` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: '#1c1c1c',
                position: 'relative',
                overflow: 'hidden',
                marginBottom: 16,
              }}
            >
              {/* gradient overlay */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)',
                  display: 'flex',
                  alignItems: 'flex-end',
                  padding: '20px 24px',
                  gap: 16,
                }}
              >
                {posterUrl && (
                  <img
                    src={posterUrl}
                    alt={featured.title}
                    style={{
                      height: 100,
                      borderRadius: 8,
                      objectFit: 'cover',
                      flexShrink: 0,
                      boxShadow: '0 6px 20px rgba(0,0,0,0.6)',
                    }}
                  />
                )}
                <div>
                  <div
                    style={{
                      fontSize: 22,
                      fontWeight: 700,
                      color: '#fff',
                      lineHeight: 1.3,
                      marginBottom: 6,
                    }}
                  >
                    {featured.title}
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13, marginBottom: 8 }}>
                    {featured.release_date?.slice(0, 4)}
                    &nbsp;·&nbsp;
                    <StarFilled style={{ color: '#e9c400', marginRight: 3 }} />
                    {(featured.vote_average ?? 0).toFixed(1)}/10
                    &nbsp;·&nbsp;
                    {(featured.original_language ?? '').toUpperCase()}
                  </div>
                  <Tag color="green" icon={<CheckCircleOutlined />}>
                    Đang hiển thị trên trang chủ
                  </Tag>
                </div>
              </div>
            </div>

            <Paragraph
              type="secondary"
              ellipsis={{ rows: 2 }}
              style={{ marginBottom: 0 }}
            >
              {featured.overview || 'Không có mô tả.'}
            </Paragraph>
          </>
        ) : (
          <Alert
            type="info"
            message="Đang dùng mặc định"
            description="Phim đầu tiên từ danh sách TMDB Now Playing sẽ tự động hiển thị. Tìm và chọn một phim bên dưới để tuỳ chỉnh."
            showIcon
          />
        )}
      </Card>

      {/* ── Search ───────────────────────────────────────── */}
      <Card title="Tìm phim để đặt làm biểu ngữ" style={{ marginBottom: 24 }}>
        <Input.Search
          placeholder='Nhập tên phim... (VD: Avatar, Avengers, Interstellar)'
          prefix={<SearchOutlined />}
          size="large"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onSearch={(val) => setSearch(val.trim())}
          enterButton="Tìm"
          allowClear
          style={{ maxWidth: 560 }}
        />
        <Text type="secondary" style={{ display: 'block', marginTop: 8, fontSize: 12 }}>
          Nhấn Enter hoặc nút "Tìm" để tìm kiếm. Kết quả từ TMDB, hỗ trợ cả tên tiếng Việt và tiếng Anh.
        </Text>
      </Card>

      {/* ── Results grid ─────────────────────────────────── */}
      {search && (
        <Card
          title={
            <span>
              Kết quả{' '}
              <Text type="secondary" style={{ fontWeight: 'normal', fontSize: 14 }}>
                "{search}" — {data?.results?.length ?? 0} phim
              </Text>
            </span>
          }
        >
          <Spin spinning={isFetching} tip="Đang tìm kiếm...">
            {!isFetching && !data?.results?.length ? (
              <Empty description="Không tìm thấy phim nào. Thử từ khoá khác." />
            ) : (
              <Row gutter={[14, 14]}>
                {data?.results?.map((movie) => {
                  const p = TMDB_IMAGE(movie.poster_path, 'w500');
                  const isSelected = featured?.id === movie.id;
                  return (
                    <Col key={movie.id} xs={12} sm={8} md={6} lg={4} xl={3}>
                      <Tooltip
                        title={isSelected ? '✓ Đang hiển thị' : `Chọn "${movie.title}"`}
                        placement="top"
                      >
                        <div
                          onClick={() => handleSelect(movie)}
                          style={{
                            cursor: 'pointer',
                            borderRadius: 8,
                            overflow: 'hidden',
                            border: isSelected
                              ? '2px solid #52c41a'
                              : '2px solid rgba(255,255,255,0.08)',
                            transition: 'border-color 0.2s, transform 0.15s, box-shadow 0.2s',
                            position: 'relative',
                          }}
                          onMouseEnter={(e) => {
                            if (!isSelected) {
                              e.currentTarget.style.borderColor = '#ff5449';
                              e.currentTarget.style.boxShadow =
                                '0 0 0 2px rgba(255,84,73,0.3)';
                              e.currentTarget.style.transform = 'scale(1.03)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isSelected) {
                              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                              e.currentTarget.style.boxShadow = 'none';
                              e.currentTarget.style.transform = 'scale(1)';
                            }
                          }}
                        >
                          {/* Poster */}
                          <div
                            style={{
                              aspectRatio: '2/3',
                              background: '#1c1c1c',
                              position: 'relative',
                              overflow: 'hidden',
                            }}
                          >
                            {p ? (
                              <img
                                src={p}
                                alt={movie.title}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover',
                                  display: 'block',
                                }}
                              />
                            ) : (
                              <div
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: '#555',
                                  fontSize: 11,
                                  padding: 8,
                                  textAlign: 'center',
                                }}
                              >
                                No Image
                              </div>
                            )}

                            {/* Selected badge */}
                            {isSelected && (
                              <div
                                style={{
                                  position: 'absolute',
                                  top: 6,
                                  right: 6,
                                  background: '#52c41a',
                                  borderRadius: '50%',
                                  width: 22,
                                  height: 22,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
                                }}
                              >
                                <CheckCircleOutlined style={{ color: '#fff', fontSize: 13 }} />
                              </div>
                            )}
                          </div>

                          {/* Info */}
                          <div style={{ padding: '8px 10px', background: '#1e1e1e' }}>
                            <div
                              style={{
                                fontWeight: 600,
                                fontSize: 12,
                                color: isSelected ? '#52c41a' : '#e6e1e5',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                lineHeight: 1.4,
                              }}
                            >
                              {movie.title}
                            </div>
                            <div style={{ fontSize: 11, color: '#888', marginTop: 3 }}>
                              {movie.release_date?.slice(0, 4)}
                              {' · '}
                              <StarFilled style={{ color: '#e9c400', fontSize: 10 }} />{' '}
                              {(movie.vote_average ?? 0).toFixed(1)}
                            </div>
                          </div>
                        </div>
                      </Tooltip>
                    </Col>
                  );
                })}
              </Row>
            )}
          </Spin>
        </Card>
      )}
    </div>
  );
}
