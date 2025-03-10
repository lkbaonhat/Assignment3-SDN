import React, { useState, useEffect } from "react";
import { Typography, Input, Select, Spin, Empty, Breadcrumb } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import styled from "styled-components";

import { Perfume, Brand } from "@/types";
import { getAllBrands } from "@/services/brandService";
import {
  filterPerfumesByBrand,
  getAllPerfumes,
  searchPerfumes,
} from "@/services/perfumeService";
import PerfumeList from "@/components/Perfumes/PerfumeList";

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;

const Container = styled.div`
  padding: 0 0 32px 0;
`;

const FilterSection = styled.div`
  display: flex;
  margin: 24px 0;
  flex-wrap: wrap;
  gap: 16px;
`;

const HomePage: React.FC = () => {
  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [selectedBrand, setSelectedBrand] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const brandsData = await getAllBrands();
        setBrands(brandsData);

        const perfumesData = await getAllPerfumes();
        setPerfumes(perfumesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = async (value: string) => {
    if (!value.trim()) {
      const perfumesData = await getAllPerfumes();
      setPerfumes(perfumesData);
      setSearchKeyword("");
      return;
    }

    try {
      setLoading(true);
      const data = await searchPerfumes(value);
      setPerfumes(data);
      setSearchKeyword(value);
      setSelectedBrand("");
    } catch (error) {
      console.error("Error searching perfumes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBrandFilter = async (value: string) => {
    try {
      setLoading(true);
      setSelectedBrand(value);
      setSearchKeyword("");

      if (!value) {
        const perfumesData = await getAllPerfumes();
        setPerfumes(perfumesData);
      } else {
        const data = await filterPerfumesByBrand(value);
        setPerfumes(data);
      }
    } catch (error) {
      console.error("Error filtering by brand:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>
          <HomeOutlined />
        </Breadcrumb.Item>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
      </Breadcrumb>

      <Title level={2}>Discover Premium Perfumes</Title>

      <FilterSection>
        <Search
          placeholder="Search perfumes..."
          allowClear
          enterButton
          style={{ width: 300 }}
          onSearch={handleSearch}
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />

        <Select
          allowClear
          style={{ width: 200 }}
          placeholder="Filter by Brand"
          onChange={handleBrandFilter}
          value={selectedBrand}
        >
          {brands.map((brand) => (
            <Option key={brand._id} value={brand._id}>
              {brand.brandName}
            </Option>
          ))}
        </Select>
      </FilterSection>

      {loading ? (
        <div style={{ textAlign: "center", padding: "50px 0" }}>
          <Spin size="large" />
        </div>
      ) : (
        <PerfumeList perfumes={perfumes} loading={loading} />
      )}
    </Container>
  );
};

export default HomePage;
