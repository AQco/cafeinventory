import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import index from './Cafeinventory'; // Adjust the import path as necessary

ReactDOM.render(
  <Router>
    <CafeInventoryApp />
  </Router>,
  document.getElementById('root')
);


import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertCircle, Coffee, Package, Truck, BarChart2, Bell, Menu, Search, MinusCircle, PlusCircle, Trash2, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Mock data for demonstration purposes
const initialInventoryData = [
  { id: 1, name: 'Coffee Beans', quantity: 50, unit: 'kg', threshold: 20, supplier: 'Bean Co.', lastUpdated: new Date().toISOString() },
  { id: 2, name: 'Milk', quantity: 30, unit: 'L', threshold: 10, supplier: 'Dairy Farm', lastUpdated: new Date().toISOString() },
  { id: 3, name: 'Sugar', quantity: 40, unit: 'kg', threshold: 15, supplier: 'Sweet Supplies', lastUpdated: new Date().toISOString() },
];

const initialSuppliers = [
  { id: 1, name: 'Bean Co.', contact: 'john@beanco.com', phone: '123-456-7890' },
  { id: 2, name: 'Dairy Farm', contact: 'mary@dairyfarm.com', phone: '234-567-8901' },
  { id: 3, name: 'Sweet Supplies', contact: 'sam@sweetsupplies.com', phone: '345-678-9012' },
];

const CafeInventoryApp = () => {
  const [inventory, setInventory] = useState(initialInventoryData);
  const [suppliers, setSuppliers] = useState(initialSuppliers);
  const [newItem, setNewItem] = useState({ name: '', quantity: '', unit: '', threshold: '', supplier: '' });
  const [newSupplier, setNewSupplier] = useState({ name: '', contact: '', phone: '' });
  const [activeView, setActiveView] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [updateQuantity, setUpdateQuantity] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    const filtered = inventory.filter(item =>
      item.name.toLowerCase().startsWith(searchTerm.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [searchTerm, inventory]);

  const handleAddItem = () => {
    if (newItem.name && newItem.quantity && newItem.unit && newItem.threshold && newItem.supplier) {
      setInventory([...inventory, { 
        ...newItem, 
        id: inventory.length + 1, 
        quantity: parseInt(newItem.quantity), 
        threshold: parseInt(newItem.threshold),
        lastUpdated: new Date().toISOString()
      }]);
      setNewItem({ name: '', quantity: '', unit: '', threshold: '', supplier: '' });
    }
  };

  const handleRemoveItem = (id) => {
    setInventory(inventory.filter(item => item.id !== id));
  };

  const handleUpdateQuantity = () => {
    const item = inventory.find(item => item.name.toLowerCase() === searchTerm.toLowerCase());
    if (item && updateQuantity) {
      const updatedInventory = inventory.map(invItem => 
        invItem.id === item.id 
          ? { 
              ...invItem, 
              quantity: Math.max(0, invItem.quantity - parseInt(updateQuantity)),
              lastUpdated: new Date().toISOString()
            }
          : invItem
      );
      setInventory(updatedInventory);
      setSearchTerm('');
      setUpdateQuantity('');
    }
  };

  const handleAddSupplier = () => {
    if (newSupplier.name && newSupplier.contact && newSupplier.phone) {
      setSuppliers([...suppliers, { ...newSupplier, id: suppliers.length + 1 }]);
      setNewSupplier({ name: '', contact: '', phone: '' });
    }
  };

  const handleRemoveSupplier = (id) => {
    setSuppliers(suppliers.filter(supplier => supplier.id !== id));
  };

  const downloadCSV = () => {
    const headers = ['Name', 'Quantity', 'Unit', 'Threshold', 'Supplier', 'Last Updated'];
    const csvContent = [
      headers.join(','),
      ...inventory.map(item => 
        [item.name, item.quantity, item.unit, item.threshold, item.supplier, item.lastUpdated].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `inventory_${new Date().toISOString()}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const renderDashboard = () => (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Select 
          onValueChange={(value) => setSearchTerm(value)}
          value={searchTerm}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Search item" />
          </SelectTrigger>
          <SelectContent>
            {filteredItems.map(item => (
              <SelectItem key={item.id} value={item.name}>{item.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input 
          type="number"
          placeholder="Quantity to remove"
          value={updateQuantity}
          onChange={(e) => setUpdateQuantity(e.target.value)}
        />
        <Button onClick={handleUpdateQuantity}>
          <MinusCircle className="mr-2 h-4 w-4" /> Update Stock
        </Button>
        <Button onClick={downloadCSV}>
          <Download className="mr-2 h-4 w-4" /> Download CSV
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="mr-2" /> Inventory Tracking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul>
              {inventory.map(item => (
                <li key={item.id} className="mb-2">
                  {item.name}: {item.quantity} {item.unit} {item.quantity <= item.threshold && 
                    <span className="text-red-500 font-bold">(Low Stock!)</span>}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart2 className="mr-2" /> Usage Report
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={inventory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="quantity" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderInventory = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <CardTitle>Full Inventory</CardTitle>
        <Dialog>
          <DialogTrigger asChild>
            <Button><PlusCircle className="mr-2 h-4 w-4" /> Add Item</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Item</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              <Input 
                placeholder="Item Name" 
                value={newItem.name} 
                onChange={(e) => setNewItem({...newItem, name: e.target.value})}
              />
              <Input 
                type="number" 
                placeholder="Quantity" 
                value={newItem.quantity} 
                onChange={(e) => setNewItem({...newItem, quantity: e.target.value})}
              />
              <Input 
                placeholder="Unit (e.g., kg, L)" 
                value={newItem.unit} 
                onChange={(e) => setNewItem({...newItem, unit: e.target.value})}
              />
              <Input 
                type="number" 
                placeholder="Threshold" 
                value={newItem.threshold} 
                onChange={(e) => setNewItem({...newItem, threshold: e.target.value})}
              />
              <Select onValueChange={(value) => setNewItem({...newItem, supplier: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Supplier" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map(supplier => (
                    <SelectItem key={supplier.id} value={supplier.name}>{supplier.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleAddItem}>Add Item</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardContent>
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left">Name</th>
                <th className="text-left">Quantity</th>
                <th className="text-left">Unit</th>
                <th className="text-left">Threshold</th>
                <th className="text-left">Supplier</th>
                <th className="text-left">Last Updated</th>
                <th className="text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map(item => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>{item.unit}</td>
                  <td>{item.threshold}</td>
                  <td>{item.supplier}</td>
                  <td>{new Date(item.lastUpdated).toLocaleString()}</td>
                  <td>
                    <Button variant="destructive" onClick={() => handleRemoveItem(item.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );

  const renderSuppliers = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <CardTitle className="text-left">Supplier Database</CardTitle>
        <Dialog>
          <DialogTrigger asChild>
            <Button><PlusCircle className="mr-2 h-4 w-4" /> Add Supplier</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Supplier</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              <Input 
                placeholder="Supplier Name" 
                value={newSupplier.name} 
                onChange={(e) => setNewSupplier({...newSupplier, name: e.target.value})}
              />
              <Input 
                placeholder="Contact Email" 
                value={newSupplier.contact} 
                onChange={(e) => setNewSupplier({...newSupplier, contact: e.target.value})}
              />
              <Input 
                placeholder="Phone Number" 
                value={newSupplier.phone} 
                onChange={(e) => setNewSupplier({...newSupplier, phone: e.target.value})}
              />
              <Button onClick={handleAddSupplier}>Add Supplier</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardContent>
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left">Name</th>
                <th className="text-left">Contact</th>
                <th className="text-left">Phone</th>
                <th className="text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map(supplier => (
                <tr key={supplier.id}>
                  <td>{supplier.name}</td>
                  <td>{supplier.contact}</td>
                  <td>{supplier.phone}</td>
                  <td>
                    <Button variant="destructive" onClick={() => handleRemoveSupplier(supplier.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Café Inventory Management</h1>
        <nav>
          <Button variant="ghost" onClick={() => setActiveView('dashboard')}>Dashboard</Button>
          <Button variant="ghost" onClick={() => setActiveView('inventory')}>Inventory</Button>
          <Button variant="ghost" onClick={() => setActiveView('suppliers')}>Suppliers</Button>
        </nav>
      </header>
      
      {activeView === 'dashboard' && renderDashboard()}
      {activeView === 'inventory' && renderInventory()}
      {activeView === 'suppliers' && renderSuppliers()}

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Low Stock Alert</AlertTitle>
        <AlertDescription>
          Coffee Beans are running low. Current stock: 50 kg (Threshold: 20 kg)
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default CafeInventoryApp;
