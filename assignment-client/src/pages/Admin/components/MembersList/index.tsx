import React from "react";
import { Table, Tag } from "antd";
import moment from "moment";
import { AuthUser } from "@/types";

interface MembersListProps {
  members: AuthUser[];
  loading: boolean;
}

const MembersList: React.FC<MembersListProps> = ({ members, loading }) => {
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a: AuthUser, b: AuthUser) => a.name.localeCompare(b.name),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Year of Birth",
      dataIndex: "YOB",
      key: "YOB",
      sorter: (a: AuthUser, b: AuthUser) => a.YOB - b.YOB,
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      render: (gender: boolean) => (gender ? "Male" : "Female"),
      filters: [
        { text: "Male", value: true },
        { text: "Female", value: false },
      ],
      onFilter: (value: boolean, record: AuthUser) => record.gender === value,
    },
    {
      title: "Role",
      key: "role",
      render: (record: AuthUser) => (
        <Tag color={record.isAdmin ? "gold" : "blue"}>
          {record.isAdmin ? "Admin" : "Member"}
        </Tag>
      ),
      filters: [
        { text: "Admin", value: true },
        { text: "Member", value: false },
      ],
      onFilter: (value: boolean, record: AuthUser) => record.isAdmin === value,
    },
    {
      title: "Joined Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => moment(date).format("YYYY-MM-DD"),
      sorter: (a: AuthUser, b: AuthUser) =>
        moment(a.createdAt).unix() - moment(b.createdAt).unix(),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={members.map((member) => ({ ...member, key: member._id }))}
      loading={loading}
      pagination={{ pageSize: 10 }}
    />
  );
};

export default MembersList;
