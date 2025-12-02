import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";

const recentOrders = [
  { id: "#3210", customer: "John Smith", product: "Wireless Headphones", amount: "$199.00", status: "completed" },
  { id: "#3209", customer: "Sarah Johnson", product: "Smart Watch", amount: "$299.00", status: "processing" },
  { id: "#3208", customer: "Mike Davis", product: "Laptop Stand", amount: "$49.00", status: "completed" },
  { id: "#3207", customer: "Emily Brown", product: "USB-C Hub", amount: "$79.00", status: "pending" },
  { id: "#3206", customer: "Chris Wilson", product: "Mechanical Keyboard", amount: "$159.00", status: "completed" },
];

const statusColors = {
  completed: "bg-green-100 text-green-800",
  processing: "bg-blue-100 text-blue-800",
  pending: "bg-yellow-100 text-yellow-800",
};

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.product}</TableCell>
                <TableCell>{order.amount}</TableCell>
                <TableCell>
                  <Badge className={statusColors[order.status as keyof typeof statusColors]}>
                    {order.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
