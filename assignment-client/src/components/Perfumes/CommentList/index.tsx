import React, { useContext, useState } from "react";
import { List, Avatar, Rate, Tooltip, Button, Popconfirm, message } from "antd";
import { Comment } from "@ant-design/compatible";
import { UserOutlined, DeleteOutlined } from "@ant-design/icons";
import moment from "moment";
import { AuthContext } from "@/context/AuthContext";
import { Comment as CommentType } from "@/types";
import { deleteComment } from "@/services/perfumeService";

interface CommentListProps {
  comments: CommentType[];
  perfumeId: string;
  onCommentUpdate: () => void;
}

const CommentList: React.FC<CommentListProps> = ({
  comments,
  perfumeId,
  onCommentUpdate,
}) => {
  const { currentUser } = useContext(AuthContext);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(
    null
  );

  const handleDeleteComment = async (commentId: string) => {
    try {
      setDeletingCommentId(commentId);
      await deleteComment(perfumeId, commentId);
      message.success("Comment deleted successfully");
      onCommentUpdate();
    } catch (error) {
      message.error("Failed to delete comment");
      console.error(error);
    } finally {
      setDeletingCommentId(null);
    }
  };

  const canDelete = (comment: CommentType): boolean => {
    // Allow users to delete their own comments or admins to delete any comment
    return currentUser !== null && comment.author._id === currentUser._id;
  };

  return (
    <List
      className="comment-list"
      header={`${comments.length} ${
        comments.length === 1 ? "reply" : "replies"
      }`}
      itemLayout="horizontal"
      dataSource={comments}
      renderItem={(comment) => (
        <List.Item
          actions={
            canDelete(comment)
              ? [
                  <Popconfirm
                    key="delete"
                    title="Are you sure you want to delete this comment?"
                    onConfirm={() => handleDeleteComment(comment._id)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button
                      icon={<DeleteOutlined />}
                      danger
                      type="text"
                      loading={deletingCommentId === comment._id}
                    >
                      Delete
                    </Button>
                  </Popconfirm>,
                ]
              : []
          }
        >
          <Comment
            author={<span>{comment.author.name}</span>}
            avatar={<Avatar icon={<UserOutlined />} />}
            content={
              <>
                <Rate disabled defaultValue={comment.rating} />
                <p>{comment.content}</p>
              </>
            }
            datetime={
              <Tooltip
                title={moment(comment.createdAt).format("YYYY-MM-DD HH:mm:ss")}
              >
                {moment(comment.createdAt).fromNow()}
              </Tooltip>
            }
          />
        </List.Item>
      )}
    />
  );
};

export default CommentList;
