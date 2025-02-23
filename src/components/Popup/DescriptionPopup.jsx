import { useRef } from "react";
import { Modal, Button } from "antd";
import JoditEditor from "jodit-react";

const DescriptionPopup = ({ isOpen, onClose, description, onSave }) => {
  const editorRef = useRef(null);

  const handleSave = () => {
    const updatedDescription = editorRef.current?.value;
    onSave(updatedDescription);
    onClose();
  };

  return (
    <Modal
      title="Chỉnh sửa mô tả"
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={1000}
    >
      <JoditEditor ref={editorRef} value={description} />

      <div className="flex justify-end gap-2 mt-4">
        <Button onClick={onClose}>Hủy</Button>
        <Button type="primary" onClick={handleSave}>
          Lưu
        </Button>
      </div>
    </Modal>
  );
};

export default DescriptionPopup;
