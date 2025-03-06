import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Button, Modal, Tooltip } from "antd";
import { toast } from "react-toastify";
import TableComponent from "@components/common/TableComponent";
import { Plus } from "lucide-react";
import { formatDate } from "@helpers/FormatDate";
import { getAllArticles } from "@redux/thunk/articleThunk";
import ArticlePopup from "@components/Popup/ArticlePopup";

const ArticlePage = () => {
  const dispatch = useDispatch();
  //   const { articles, loading } = useSelector((state) => state.coupon);
  const { articles, loading } = useSelector((state) => state.article);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const [editingArticle, setEditingArticle] = useState({});
  const accessToken = localStorage.getItem("accessToken");
  useEffect(() => {
    dispatch(getAllArticles(accessToken));
  }, [dispatch, accessToken]);

  const handleSelected = (keys) => {
    const selected = articles?.filter((article) => keys.includes(article.id));
    setSelectedRowKeys(keys);
    setSelectedRows(selected);
  };

  const confirmDelete = async () => {
    setIsDeleteModalOpen(false);
    toast.success("Xóa sản phẩm thành công!");
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      width: 50,
      align: "center",
    },
    {
      title: "Ảnh bìa",
      dataIndex: "thumbnail",
      align: "center",
      key: "thumbnail",
      width: 120,
      render: (thumbnail) =>
        thumbnail ? (
          <Tooltip title={<img src={thumbnail} alt="Preview" width={150} />}>
            <img
              src={thumbnail}
              alt="Thumbnail"
              style={{
                width: 50,
                height: 50,
                objectFit: "cover",
                borderRadius: 4,
              }}
            />
          </Tooltip>
        ) : (
          "Không có ảnh"
        ),
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Tác giả",
      dataIndex: "author",
      key: "author",
      width: 150,
    },

    {
      title: "Trạng thái",
      dataIndex: "visible",
      key: "visible",
      width: 130,
      render: (visible) => (
        <span
          className={
            visible === true
              ? "text-green-500 bg-green-100 px-2 py-1 rounded-full font-semibold"
              : "text-red-500 bg-red-100 px-2 py-1 rounded-full font-semibold"
          }
        >
          {visible ? "Hiển thị" : "Đã ẩn"}
        </span>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
      render: (date) => formatDate(date),
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: 160,
      render: (date) => formatDate(date),
    },
  ];

  const rows = articles?.map((article, index) => ({
    stt: index + 1, // Số thứ tự bắt đầu từ 1
    ...article,
    key: article.id,
    thumbnailImageId: article.thumbnailImageId,
    thumbnail: article.thumbnailImage ? article.thumbnailImage.path : null,
    title: article.title,
    author: article.author,
    content: article.content,
    visible: article.visible,
    createdAt: article.createdAt,
    updatedAt: article.updatedAt,
  }));

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className=""></div>
        <Button
          type="primary"
          icon={<Plus size={28} />}
          onClick={() => {
            setEditingArticle({}); // Đối tượng rỗng cho chế độ tạo mới sản phẩm
            setIsUpdateModalOpen(true);
          }}
        >
          Thêm bài viết
        </Button>
      </div>
      <TableComponent
        loading={loading}
        onEdit={(record) => {
          setEditingArticle(record);
          // console.log("Sửa sản phẩm:", record);
          setIsUpdateModalOpen(true);
        }}
        onDelete={(record) => {
          // console.log("xóa sản phẩm:", record);

          setSelectedRowKeys([record.key]);
          setIsDeleteModalOpen(true);
        }}
        checkbox={false}
        rows={rows}
        columns={columns}
        pagination={{ pageSize: 5 }}
        handleSelected={handleSelected}
      />
      {/* Modal xác nhận xóa */}

      <Modal
        title="Xác nhận xóa"
        open={isDeleteModalOpen}
        onOk={confirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        okText="Xóa"
        cancelText="Hủy"
      >
        <p>Bạn có chắc chắn muốn xóa sản phẩm đã chọn không?</p>
      </Modal>
      {/* Modal xác nhận cập nhật */}

      <ArticlePopup
        isOpen={isUpdateModalOpen}
        onClose={() => {
          setIsUpdateModalOpen(false);
        }}
        data={editingArticle}
      />
    </div>
  );
};

export default ArticlePage;
