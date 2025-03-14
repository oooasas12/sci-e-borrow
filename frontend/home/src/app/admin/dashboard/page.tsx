"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/Layouts/default";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  Activity,
  Users,
  Package,
  AlertTriangle,
  Clock,
  CheckCircle,
  Loader2,
  CreditCard,
  DollarSign,
  Download,
  Search,
  Printer
} from "lucide-react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

// ประกาศ interface สำหรับข้อมูล dashboard
interface DashboardSummary {
  totalEquipment: number;
  availableEquipment: number;
  borrowedEquipment: number;
  brokenEquipment: number;
  totalUsers: number;
  pendingApprovals: number;
  completedBorrows: number;
  activeBorrows: number;
  lostEquipment: number;
}

interface BorrowStatsByMonth {
  month: number;
  year: number;
  count: number;
  monthLabel: string;
}

interface EquipmentTypeStats {
  typeId: number;
  typeName: string;
  count: number;
}

interface BorrowList {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: null | string;
  DateBorrow: string;
  DateReturn: string | null;
  DocBorrow: string;
  DocReturn: string;
  ApprovalStatusBorrowID: number;
  ApprovalStatusBorrow: {
    ID: number;
    CreatedAt: string;
    UpdatedAt: string;
    DeletedAt: null | string;
    Name: string;
  };
  ApprovalStatusReturnID: number;
  ApprovalStatusReturn: {
    ID: number;
    CreatedAt: string;
    UpdatedAt: string;
    DeletedAt: null | string;
    Name: string;
  };
  UserID: number;
  User: {
    ID: number;
    CreatedAt: string;
    UpdatedAt: string;
    DeletedAt: null | string;
    Name: string;
    Username: string;
    Password: string;
    PositionFacID: number;
    PositionFac: {
      ID: number;
      CreatedAt: string;
      UpdatedAt: string;
      DeletedAt: null | string;
      Name: string;
    };
    PositionBranchID: number;
    PositionBranch: {
      ID: number;
      CreatedAt: string;
      UpdatedAt: string;
      DeletedAt: null | string;
      Name: string;
    };
    BranchID: number;
    Branch: {
      ID: number;
      CreatedAt: string;
      UpdatedAt: string;
      DeletedAt: null | string;
      Name: string;
    };
  };
}

interface Branch {
  ID: number;
  Name: string;
}

interface MonthlyBorrowCount {
  month: number;
  count: number;
  monthLabel: string;
}

interface YearlyBorrowStats {
  year: number;
  monthlyData: MonthlyBorrowCount[];
}

interface DashboardData {
  summary: DashboardSummary;
  borrowStats: BorrowStatsByMonth[];
  equipmentTypeData: EquipmentTypeStats[];
  recentBorrows: BorrowList[];
  branches: Branch[];
  availableYears: number[];
  yearlyStats: YearlyBorrowStats[];
}

// สีสำหรับ PieChart
const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82ca9d",
  "#ffc658",
  "#8dd1e1",
];

export default function Dashboard() {
  // State สำหรับข้อมูลทั้งหมด
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );
  // State แยกสำหรับข้อมูลกราฟ
  const [borrowStats, setBorrowStats] = useState<BorrowStatsByMonth[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  // State แยกสำหรับการโหลดกราฟ
  const [chartLoading, setChartLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>(
    new Date().getFullYear().toString(),
  );
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [yearlyStats, setYearlyStats] = useState<YearlyBorrowStats[]>([]);
  const [yearlyStatsLoading, setYearlyStatsLoading] = useState(false);

  // ฟังก์ชันดึงข้อมูลทั้งหมด
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/dashboard`,
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setDashboardData(data.data);
      setBorrowStats(data.data.borrowStats || []);

      // ถ้าไม่ได้เลือกปี ให้เลือกปีล่าสุดจากข้อมูลที่ได้
      if (data.data.availableYears && data.data.availableYears.length > 0) {
        setSelectedYear(data.data.availableYears[0].toString());
      }

      setError(null);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("ไม่สามารถโหลดข้อมูล Dashboard ได้");
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชันดึงเฉพาะข้อมูลกราฟ
  const fetchBorrowStats = async (year: string, branchId: string) => {
    try {
      setChartLoading(true);
      // สร้าง query string จากพารามิเตอร์
      const params = new URLSearchParams();
      if (year) params.append("year", year);
      if (branchId) params.append("branch_id", branchId);

      const queryString = params.toString() ? `?${params.toString()}` : "";
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/dashboard/borrow-stats${queryString}`,
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setBorrowStats(data.data || []);
    } catch (err) {
      console.error("Error fetching borrow stats:", err);
      // ไม่ต้องแสดง error ทั้งหน้า เพราะเป็นเพียงส่วนเดียวที่มีปัญหา
    } finally {
      setChartLoading(false);
    }
  };

  // ฟังก์ชันดึงข้อมูลสถิติการยืมรายปี
  const fetchYearlyBorrowStats = async (branchId: string) => {
    try {
      setYearlyStatsLoading(true);
      // สร้าง query string จากพารามิเตอร์
      const params = new URLSearchParams();
      if (branchId) params.append("branch_id", branchId);

      const queryString = params.toString() ? `?${params.toString()}` : "";
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/dashboard/yearly-borrow-stats${queryString}`,
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setYearlyStats(data.data || []);
    } catch (err) {
      console.error("Error fetching yearly borrow stats:", err);
      // ไม่ต้องแสดง error ทั้งหน้า เพราะเป็นเพียงส่วนเดียวที่มีปัญหา
    } finally {
      setYearlyStatsLoading(false);
    }
  };

  // โหลดข้อมูลทั้งหมดเมื่อเริ่มต้น
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // เมื่อเลือกปีหรือสาขาใหม่ ให้ดึงข้อมูลสถิติการยืมรายเดือนใหม่
  useEffect(() => {
    if (dashboardData) {
      fetchBorrowStats(selectedYear, selectedBranch);
    }
  }, [selectedYear, selectedBranch, dashboardData]);

  // ดึงข้อมูลสถิติการยืมรายปีเมื่อเลือกสาขาใหม่
  useEffect(() => {
    if (dashboardData) {
      fetchYearlyBorrowStats(selectedBranch);
    }
  }, [selectedBranch, dashboardData]);

  // ผู้ใช้เลือกปี
  const handleYearChange = (year: number) => {
    setSelectedYear(year.toString());
  };

  // ผู้ใช้เลือกสาขา
  const handleBranchChange = (branchId: number | "") => {
    setSelectedBranch(branchId.toString());
  };

  // ฟังก์ชันสำหรับการพิมพ์ PDF
  const handlePrintPDF = () => {
    // เพิ่ม class ให้กับ body เพื่อซ่อน sidebar
    document.body.classList.add('printing');
    
    // แสดงส่วน print-only
    const printSection = document.getElementById('print-section');
    if (printSection) {
      printSection.style.display = 'block';
    }
    
    // พิมพ์หน้าเว็บ
    window.print();
    
    // ซ่อนส่วน print-only หลังจากพิมพ์เสร็จ
    setTimeout(() => {
      document.body.classList.remove('printing');
      if (printSection) {
        printSection.style.display = 'none';
      }
    }, 1000);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">กำลังโหลดข้อมูล...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <AlertTriangle className="h-8 w-8 text-destructive" />
        <span className="ml-2">{error}</span>
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  return (
    <>
      <div id="print-section" className="dashboard-layout container mx-auto p-4 print-only">
        <h1 className="mb-6 text-2xl font-bold">แดชบอร์ดระบบยืม-คืนอุปกรณ์</h1>

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 dashboard-summary">
          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                อุปกรณ์ทั้งหมด
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardData.summary.totalEquipment}
              </div>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                อุปกรณ์ที่พร้อมใช้งาน
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardData.summary.availableEquipment}
              </div>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                อุปกรณ์ที่สูญหาย
              </CardTitle>
              <Search className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardData.summary.lostEquipment || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                อุปกรณ์ชำรุด
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardData.summary.brokenEquipment}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="dashboard-charts tabs-content">
          <div className="grid grid-cols-1 gap-4">
            <Card className="w-full borrow-stats-chart">
              <CardHeader>
                <CardTitle>สถิติการยืมรายเดือน</CardTitle>
                {selectedBranch && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    กรองตามสาขา:{" "}
                    {dashboardData.branches?.find(
                      (b) => b.ID.toString() === selectedBranch,
                    )?.Name || ""}
                  </p>
                )}
              </CardHeader>
              <CardContent className="h-[400px]">
                {borrowStats.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={borrowStats}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="monthLabel" 
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill="#8884d8" name="จำนวนการยืม" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-muted-foreground">ไม่พบข้อมูลการยืมในช่วงเวลาที่เลือก</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <Card className="equipment-type-chart">
                <CardHeader>
                  <CardTitle>สัดส่วนประเภทอุปกรณ์</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    {dashboardData.equipmentTypeData ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={dashboardData.equipmentTypeData}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            label={({ name, percent }) =>
                              `${name} (${(percent * 100).toFixed(0)}%)`
                            }
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="count"
                            nameKey="typeName"
                          >
                            {dashboardData.equipmentTypeData.map(
                              (entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                />
                              ),
                            )}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <p className="text-muted-foreground">
                          ไม่มีข้อมูลประเภทอุปกรณ์
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="yearly-stats-chart">
                <CardHeader>
                  <CardTitle>เปรียบเทียบการยืมรายปี</CardTitle>
                  {selectedBranch && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      กรองตามสาขา:{" "}
                      {dashboardData.branches?.find(
                        (b) => b.ID.toString() === selectedBranch,
                      )?.Name || ""}
                    </p>
                  )}
                </CardHeader>
                <CardContent className="h-80">
                  {yearlyStats.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={yearlyStats
                          .flatMap((year) =>
                            year.monthlyData.map((month, index) => ({
                              month: month.monthLabel,
                              [year.year]: month.count,
                            })),
                          )
                          .reduce((acc, curr, index) => {
                            // ถ้ายังไม่มีข้อมูลเดือนนี้ ให้เพิ่มเข้าไป
                            if (
                              !acc.find((item) => item.month === curr.month)
                            ) {
                              acc.push(curr);
                            } else {
                              // ถ้ามีข้อมูลเดือนนี้แล้ว ให้รวมข้อมูลปีเข้าไป
                              const existingItem = acc.find(
                                (item) => item.month === curr.month,
                              );
                              if (existingItem) {
                                Object.assign(existingItem, curr);
                              }
                            }
                            return acc;
                          }, [] as any[])
                          .sort((a, b) => {
                            const months = [
                              "Jan",
                              "Feb",
                              "Mar",
                              "Apr",
                              "May",
                              "Jun",
                              "Jul",
                              "Aug",
                              "Sep",
                              "Oct",
                              "Nov",
                              "Dec",
                            ];
                            return (
                              months.indexOf(a.month) -
                              months.indexOf(b.month)
                            );
                          })}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {yearlyStats.map((year, index) => (
                          <Line
                            key={year.year}
                            type="monotone"
                            dataKey={year.year.toString()}
                            stroke={`hsl(${index * 30}, 70%, 50%)`}
                            name={`ปี ${year.year}`}
                          />
                        ))}
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <p className="text-muted-foreground">
                        ไม่พบข้อมูลการยืม
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <div className="dashboard-tables tabs-content">
          <Card className="recent-borrows">
            <CardHeader>
              <CardTitle>การยืมล่าสุด</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>รหัสการยืม</TableHead>
                    <TableHead>วันที่ยืม</TableHead>
                    <TableHead>ผู้ยืม</TableHead>
                    <TableHead>สถานะ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dashboardData.recentBorrows?.map((borrow) => (
                    <TableRow key={borrow.ID}>
                      <TableCell className="font-medium">
                        {borrow.ID}
                      </TableCell>
                      <TableCell>
                        {new Date(borrow.DateBorrow).toLocaleDateString(
                          "th-TH",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )}
                      </TableCell>
                      <TableCell>{borrow.User?.Name}</TableCell>
                      <TableCell>
                        {borrow.ApprovalStatusBorrow?.Name}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>

      <Layout>
        <div className="dashboard-layout container mx-auto p-4 no-print">
          <h1 className="mb-6 text-2xl font-bold">แดชบอร์ดระบบยืม-คืนอุปกรณ์</h1>

          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-muted-foreground">
                ภาพรวมของระบบยืม-คืนอุปกรณ์
              </p>
            </div>
            <Button 
              onClick={handlePrintPDF} 
              className="print:hidden"
              variant="outline"
            >
              <Printer className="mr-2 h-4 w-4" />
              พิมพ์รายงาน
            </Button>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 dashboard-summary">
            <Card className="dashboard-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  อุปกรณ์ทั้งหมด
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardData.summary.totalEquipment}
                </div>
              </CardContent>
            </Card>

            <Card className="dashboard-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  อุปกรณ์ที่พร้อมใช้งาน
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardData.summary.availableEquipment}
                </div>
              </CardContent>
            </Card>

            <Card className="dashboard-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  อุปกรณ์ที่สูญหาย
                </CardTitle>
                <Search className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardData.summary.lostEquipment || 0}
                </div>
              </CardContent>
            </Card>

            <Card className="dashboard-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  อุปกรณ์ชำรุด
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardData.summary.brokenEquipment}
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="charts" className="w-full">
            <TabsList className="print:hidden">
              <TabsTrigger value="charts">กราฟข้อมูล</TabsTrigger>
              <TabsTrigger value="recent">การยืมล่าสุด</TabsTrigger>
            </TabsList>

            <TabsContent value="charts" className="dashboard-charts tabs-content">
              <div className="grid grid-cols-1 gap-4">
                <Card className="w-full borrow-stats-chart">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>สถิติการยืมรายเดือน</CardTitle>
                      {selectedBranch && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          กรองตามสาขา:{" "}
                          {dashboardData.branches?.find(
                            (b) => b.ID.toString() === selectedBranch,
                          )?.Name || ""}
                        </p>
                      )}
                    </div>
                    <div className="flex space-x-3">
                      <div className="relative w-28">
                        <Listbox value={parseInt(selectedYear)} onChange={handleYearChange}>
                          <ListboxButton className="relative w-full cursor-pointer rounded border border-gray-300 bg-white py-1 pl-3 pr-10 text-left text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
                            <span className="block truncate">{selectedYear}</span>
                            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                              <ChevronDown className="w-4 h-4 text-gray-400" />
                            </span>
                          </ListboxButton>
                          <ListboxOptions className="absolute z-10 w-full py-1 mt-1 overflow-auto bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none text-sm">
                            {dashboardData.availableYears?.map(year => (
                              <ListboxOption
                                key={year}
                                value={year}
                                className={({ active }) =>
                                  `${active ? 'text-white bg-primary_1' : 'text-gray-900'} 
                                  cursor-pointer select-none relative py-2 pl-3 pr-9`
                                }
                              >
                                {({ selected, active }) => (
                                  <span className={`${selected ? 'font-medium' : 'font-normal'} block truncate`}>
                                    {year}
                                  </span>
                                )}
                              </ListboxOption>
                            ))}
                          </ListboxOptions>
                        </Listbox>
                      </div>
                      <div className="relative w-40">
                        <Listbox value={selectedBranch === "" ? "" : parseInt(selectedBranch)} onChange={handleBranchChange}>
                          <ListboxButton className="relative w-full cursor-pointer rounded border border-gray-300 bg-white py-1 pl-3 pr-10 text-left text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
                            <span className="block truncate">
                              {selectedBranch === "" 
                                ? "ทุกสาขา" 
                                : dashboardData.branches?.find(b => b.ID.toString() === selectedBranch)?.Name || ""}
                            </span>
                            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                              <ChevronDown className="w-4 h-4 text-gray-400" />
                            </span>
                          </ListboxButton>
                          <ListboxOptions className="absolute z-10 w-full py-1 mt-1 overflow-auto bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none text-sm">
                            <ListboxOption
                              value=""
                              className={({ active }) =>
                                `${active ? 'text-white bg-primary_1' : 'text-gray-900'} 
                                cursor-pointer select-none relative py-2 pl-3 pr-9`
                              }
                            >
                              {({ selected, active }) => (
                                <span className={`${selected ? 'font-medium' : 'font-normal'} block truncate`}>
                                  ทุกสาขา
                                </span>
                              )}
                            </ListboxOption>
                            {dashboardData.branches?.map(branch => (
                              <ListboxOption
                                key={branch.ID}
                                value={branch.ID}
                                className={({ active }) =>
                                  `${active ? 'text-white bg-primary_1' : 'text-gray-900'} 
                                  cursor-pointer select-none relative py-2 pl-3 pr-9`
                                }
                              >
                                {({ selected, active }) => (
                                  <span className={`${selected ? 'font-medium' : 'font-normal'} block truncate`}>
                                    {branch.Name}
                                  </span>
                                )}
                              </ListboxOption>
                            ))}
                          </ListboxOptions>
                        </Listbox>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="h-[400px]">
                    {chartLoading ? (
                      <div className="flex items-center justify-center h-full">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                      </div>
                    ) : borrowStats.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={borrowStats}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="monthLabel" 
                            tick={{ fontSize: 12 }}
                          />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="count" fill="#8884d8" name="จำนวนการยืม" />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-muted-foreground">ไม่พบข้อมูลการยืมในช่วงเวลาที่เลือก</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <Card className="equipment-type-chart">
                    <CardHeader>
                      <CardTitle>สัดส่วนประเภทอุปกรณ์</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        {dashboardData.equipmentTypeData ? (
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={dashboardData.equipmentTypeData}
                                cx="50%"
                                cy="50%"
                                labelLine={true}
                                label={({ name, percent }) =>
                                  `${name} (${(percent * 100).toFixed(0)}%)`
                                }
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="count"
                                nameKey="typeName"
                              >
                                {dashboardData.equipmentTypeData.map(
                                  (entry, index) => (
                                    <Cell
                                      key={`cell-${index}`}
                                      fill={COLORS[index % COLORS.length]}
                                    />
                                  ),
                                )}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <p className="text-muted-foreground">
                              ไม่มีข้อมูลประเภทอุปกรณ์
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="yearly-stats-chart">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>เปรียบเทียบการยืมรายปี</CardTitle>
                        {selectedBranch && (
                          <p className="mt-1 text-sm text-muted-foreground">
                            กรองตามสาขา:{" "}
                            {dashboardData.branches?.find(
                              (b) => b.ID.toString() === selectedBranch,
                            )?.Name || ""}
                          </p>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="h-80">
                      {yearlyStatsLoading ? (
                        <div className="flex h-full items-center justify-center">
                          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                      ) : yearlyStats.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={yearlyStats
                              .flatMap((year) =>
                                year.monthlyData.map((month, index) => ({
                                  month: month.monthLabel,
                                  [year.year]: month.count,
                                })),
                              )
                              .reduce((acc, curr, index) => {
                                // ถ้ายังไม่มีข้อมูลเดือนนี้ ให้เพิ่มเข้าไป
                                if (
                                  !acc.find((item) => item.month === curr.month)
                                ) {
                                  acc.push(curr);
                                } else {
                                  // ถ้ามีข้อมูลเดือนนี้แล้ว ให้รวมข้อมูลปีเข้าไป
                                  const existingItem = acc.find(
                                    (item) => item.month === curr.month,
                                  );
                                  if (existingItem) {
                                    Object.assign(existingItem, curr);
                                  }
                                }
                                return acc;
                              }, [] as any[])
                              .sort((a, b) => {
                                const months = [
                                  "Jan",
                                  "Feb",
                                  "Mar",
                                  "Apr",
                                  "May",
                                  "Jun",
                                  "Jul",
                                  "Aug",
                                  "Sep",
                                  "Oct",
                                  "Nov",
                                  "Dec",
                                ];
                                return (
                                  months.indexOf(a.month) -
                                  months.indexOf(b.month)
                                );
                              })}
                            margin={{
                              top: 5,
                              right: 30,
                              left: 20,
                              bottom: 5,
                            }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            {yearlyStats.map((year, index) => (
                              <Line
                                key={year.year}
                                type="monotone"
                                dataKey={year.year.toString()}
                                stroke={`hsl(${index * 30}, 70%, 50%)`}
                                name={`ปี ${year.year}`}
                              />
                            ))}
                          </LineChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <p className="text-muted-foreground">
                            ไม่พบข้อมูลการยืม
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="recent" className="dashboard-tables tabs-content">
              <Card className="recent-borrows">
                <CardHeader>
                  <CardTitle>การยืมล่าสุด</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>รหัสการยืม</TableHead>
                        <TableHead>วันที่ยืม</TableHead>
                        <TableHead>ผู้ยืม</TableHead>
                        <TableHead>สถานะ</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dashboardData.recentBorrows?.map((borrow) => (
                        <TableRow key={borrow.ID}>
                          <TableCell className="font-medium">
                            {borrow.ID}
                          </TableCell>
                          <TableCell>
                            {new Date(borrow.DateBorrow).toLocaleDateString(
                              "th-TH",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              },
                            )}
                          </TableCell>
                          <TableCell>{borrow.User?.Name}</TableCell>
                          <TableCell>
                            {borrow.ApprovalStatusBorrow?.Name}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </Layout>
    </>
  );
}
