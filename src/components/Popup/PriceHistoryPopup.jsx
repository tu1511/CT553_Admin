import React from "react";
import { Modal, Table, Typography, Divider } from "antd";
import { toVietnamCurrencyFormat } from "@helpers/ConvertCurrency";
import { formatDate } from "@helpers/FormatDate";

const { Title, Text } = Typography;

const PriceHistoryPopup = ({ isOpen, onClose, variants }) => {
  const renderTable = (priceHistory) => {
    const columns = [
      {
        title: "#",
        dataIndex: "index",
        key: "index",
        render: (_, __, index) => index + 1,
        width: 60,
      },
      {
        title: "Giá",
        dataIndex: "price",
        key: "price",
        render: (value) => (
          <Text className="text-blue-600">
            {toVietnamCurrencyFormat(value)}
          </Text>
        ),
      },
      {
        title: "Ngày bắt đầu",
        dataIndex: "startDate",
        key: "startDate",
        render: (date) => <span>{formatDate(date)}</span>,
      },
      {
        title: "Ngày kết thúc",
        dataIndex: "endDate",
        key: "endDate",
        render: (date) =>
          date ? (
            <span>{formatDate(date)}</span>
          ) : (
            <Text type="success" strong>
              Hiện tại
            </Text>
          ),
      },
    ];

    return (
      <Table
        dataSource={priceHistory}
        columns={columns}
        pagination={false}
        rowKey="id"
        size="small"
      />
    );
  };

  return (
    <Modal
      title="Lịch sử giá các biến thể"
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      {variants.map((variant) => (
        <div key={variant.id} className="mb-6">
          <Divider orientation="left">
            <Text strong>Size: {variant.size}</Text>
          </Divider>
          {renderTable(variant.priceHistory)}
        </div>
      ))}
    </Modal>
  );
};

export default PriceHistoryPopup;
