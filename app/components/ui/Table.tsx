import React, { useState, useMemo } from 'react';
import Card from '@/app/components/ui/Card';
import { Search, ArrowUpDown, MoreHorizontal } from 'lucide-react';
import { Dropdown } from '@/app/components/ui/Dropdown';
import { capitalize } from '@/app/utils/capitalize';

export interface Column<T> {
  key: keyof T;
  title: string;
  sortable?: boolean;
  render?: (value: string | unknown, item?: T) => React.ReactNode;
  width?: string;
}

interface Action<T> {
  label: string;
  icon?: React.ReactNode;
  onClick: (item: T) => void;
  danger?: boolean;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  actions?: Action<T>[];
  title?: string;
  loading?: boolean;
  searchPlaceholder?: string;
  onSearch?: (term: string) => void;
  itemsPerPage?: number;
  className?: string;
}

export function DataTable<T extends { id: string | number }>({
  data,
  columns,
  actions,
  title = '',
  loading = false,
  searchPlaceholder = 'Search...',
  onSearch,
  itemsPerPage = 10,
  className = '',
}: TableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | null;
    direction: 'asc' | 'desc';
  }>({ key: null, direction: 'asc' });

  // Loading placeholder
  const LoadingRow = () => (
    <tr>
      {columns.map((col, index) => (
        <td key={index} className="px-4 py-3 whitespace-nowrap">
          <div className="animate-pulse h-4 bg-gray-200 rounded w-24"></div>
        </td>
      ))}
      {actions && (
        <td className="px-4 py-3 whitespace-nowrap">
          <div className="animate-pulse h-8 bg-gray-200 rounded w-8"></div>
        </td>
      )}
    </tr>
  );

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    onSearch?.(value);
  };

  // Handle sorting
  const handleSort = (key: keyof T) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Process data with sorting and pagination
  const processedData = useMemo(() => {
    const result = [...data];

    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key!];
        const bValue = b[sortConfig.key!];
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortConfig.direction === 'asc' 
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        
        return sortConfig.direction === 'asc'
          ? (aValue < bValue ? -1 : 1)
          : (bValue < aValue ? -1 : 1);
      });
    }

    // Apply pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    return result.slice(startIndex, startIndex + itemsPerPage);
  }, [data, sortConfig, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  // Column header component
  const SortableHeader = ({ column }: { column: Column<T> }) => (
    <th 
      scope="col" 
      className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider 
        ${column.sortable ? 'cursor-pointer group' : ''}`}
      onClick={() => column.sortable && handleSort(column.key)}
      style={{ width: column.width }}
    >
      <div className="flex items-center gap-2">
        {column.title}
        {column.sortable && (
          <ArrowUpDown className={`w-4 h-4 opacity-0 group-hover:opacity-50 transition-opacity
            ${sortConfig.key === column.key ? 'opacity-100' : ''}`}
          />
        )}
      </div>
    </th>
  );

  return (
    <Card className={className}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {title && <h2 className="text-lg font-bold">{title}</h2>}
          
          {onSearch && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, index) => (
                <SortableHeader key={index} column={column} />
              ))}
              {actions && (
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <>
                <LoadingRow />
                <LoadingRow />
                <LoadingRow />
              </>
            ) : (
              processedData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  {columns.map((column, index) => (
                    <td key={index} className="px-4 py-3 whitespace-nowrap">
                      {column.render 
                        ? column.render(item[column.key], item)
                        : capitalize(String(item[column.key]))
                      }
                    </td>
                  ))}
                  {actions && (
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <Dropdown
                        trigger={<MoreHorizontal className="w-5 h-5 text-gray-400" />}
                        align="right"
                        className="w-48"
                        triggerClassName="hover:bg-gray-100 p-1 rounded-full"
                      >
                        {actions.map((action, index) => (
                          <button
                            key={index}
                            onClick={() => action.onClick(item)}
                            className={`
                              w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-100
                              ${action.danger ? 'text-red-600 hover:bg-red-50' : ''}
                            `}
                          >
                            {action.icon}
                            {action.label}
                          </button>
                        ))}
                      </Dropdown>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-700">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, data.length)} of {data.length} results
            </p>
            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`
                    px-3 py-1 text-sm rounded-md
                    ${currentPage === page
                      ? 'bg-primary text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}
                  `}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}