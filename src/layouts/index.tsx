import React from 'react';
// @ts-ignore
import { Link, Outlet } from 'umi';
import 'antd/dist/antd.css'

export default function Layout() {
  return (
    <div className="relative">
      <Outlet />
    </div>
  );
}
