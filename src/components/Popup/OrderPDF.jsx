import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import Roboto from "@assets/font/Roboto-Regular.ttf";
import RobotoBold from "@assets/font/Roboto-Bold.ttf";
import RobotoItalic from "@assets/font/Roboto-Italic.ttf";
import { toVietnamCurrencyFormat } from "@helpers/ConvertCurrency";

Font.register({
  family: "Roboto",
  fonts: [
    { src: Roboto, fontWeight: "normal" },
    { src: RobotoBold, fontWeight: "bold" },
    { src: RobotoItalic, fontWeight: "italic" },
  ],
});

const styles = StyleSheet.create({
  page: { padding: 20, fontFamily: "Roboto" },
  section: {
    marginBottom: 15,
    borderBottom: "1 solid #ddd",
    paddingBottom: 10,
  },
  title: {
    fontSize: 18,
    fontFamily: "Roboto",
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  text: { fontSize: 12, marginBottom: 10, color: "#555" },
  boldText: { fontSize: 12, fontWeight: "bold", color: "#000", padding: 5 },
  table: {
    display: "table",
    width: "100%",
    marginTop: 5,
    border: "1 solid #ddd",
  },
  tableRow: { flexDirection: "row", borderBottom: "1 solid #ddd", padding: 5 },
  tableHeader: {
    fontWeight: "bold",
    backgroundColor: "#f0f0f0",
    borderBottom: "2 solid #000",
  },
  tableCell: { fontSize: 12, padding: 5, textAlign: "center" },
  tableCellName: { flex: 2, textAlign: "left" },
  tableCellSmall: { flex: 1, textAlign: "center" },
  storeInfo: { textAlign: "center", marginBottom: 15 },
  totalprice: { textAlign: "right", marginTop: 15 },
  thanks: { textAlign: "center", marginTop: 15 },
});

function OrderPDF({ order }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.storeInfo}>
          <Text style={styles.title}>CỬA HÀNG TRANG SỨC BẠC SILVER CHARM</Text>
          <Text style={styles.text}>
            Địa chỉ: 3/2, Xuân Khánh, Quận Ninh Kiều, TP. Cần Thơ
          </Text>
          <Text style={styles.text}>Điện thoại: 0845 969 757</Text>
          <Text style={styles.text}>Email: minhtu15112k3@gmail.com</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>Chi tiết đơn hàng</Text>
          <Text style={styles.boldText}>
            Người mua: <Text style={styles.text}>{order.buyer?.fullName}</Text>
          </Text>
          <Text style={styles.boldText}>
            Email: <Text style={styles.text}>{order.buyer?.email}</Text>
          </Text>
          <Text style={styles.boldText}>
            Số điện thoại:{" "}
            <Text style={styles.text}>
              {order.deliveryAddress?.contactPhone}
            </Text>
          </Text>
          <Text style={styles.boldText}>
            Địa chỉ:{" "}
            <Text style={styles.text}>
              {order.deliveryAddress?.detailAddress},{" "}
              {order.deliveryAddress?.wardName},{" "}
              {order.deliveryAddress?.districtName},{" "}
              {order.deliveryAddress?.provinceName}
            </Text>
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>Sản phẩm</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, styles.tableCellName]}>
                Sản phẩm
              </Text>
              <Text style={[styles.tableCell, styles.tableCellSmall]}>
                Size
              </Text>
              <Text style={[styles.tableCell, styles.tableCellSmall]}>
                Số lượng
              </Text>
              <Text style={[styles.tableCell, styles.tableCellSmall]}>
                Giá sản phẩm
              </Text>
              <Text style={[styles.tableCell, styles.tableCellSmall]}>
                Thành tiền
              </Text>
            </View>
            {order?.orderDetail?.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.tableCellName]}>
                  {item.variant?.product?.name}
                </Text>
                <Text style={[styles.tableCell, styles.tableCellSmall]}>
                  {item.variant?.size || "N/A"}
                </Text>
                <Text style={[styles.tableCell, styles.tableCellSmall]}>
                  {item.quantity}
                </Text>
                <Text style={[styles.tableCell, styles.tableCellSmall]}>
                  {toVietnamCurrencyFormat(item?.price)}
                </Text>
                <Text style={[styles.tableCell, styles.tableCellSmall]}>
                  {toVietnamCurrencyFormat(item?.price * item?.quantity)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.totalprice}>
          <Text style={styles.title}>Tổng tiền</Text>
          <Text style={styles.boldText}>
            Tổng tiền:{" "}
            <Text style={styles.text}>
              {toVietnamCurrencyFormat(order.totalPrice)}
            </Text>
          </Text>
          <Text style={styles.boldText}>
            Giá giảm:{" "}
            <Text style={styles.text}>
              {toVietnamCurrencyFormat(order.totalDiscount)}
            </Text>
          </Text>
          <Text style={styles.boldText}>
            Phí giao hàng:{" "}
            <Text style={styles.text}>
              {toVietnamCurrencyFormat(order.shippingFee)}
            </Text>
          </Text>
          <Text style={[styles.boldText, { fontSize: 14, color: "#D32F2F" }]}>
            Thành tiền:{" "}
            <Text style={styles.text}>
              {toVietnamCurrencyFormat(order.finalPrice)}
            </Text>
          </Text>
        </View>

        <View style={styles.thanks}>
          <Text style={styles.text}>
            Cảm ơn quý khách đã mua hàng tại cửa hàng chúng tôi!
          </Text>
        </View>
      </Page>
    </Document>
  );
}

export default OrderPDF;
