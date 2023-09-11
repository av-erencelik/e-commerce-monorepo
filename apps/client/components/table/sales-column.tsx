'use client';
import { Button, useToast } from '@e-commerce-monorepo/ui';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@e-commerce-monorepo/ui';
import { capitalizeFirstLetter, getErrorMessage } from '@client/lib/utils';
import { SalesColumn } from '@client/types/column';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { deleteSale } from '@client/lib/api/api-service';
import { DateFormatter } from '@internationalized/date';

export const salesColumn: ColumnDef<SalesColumn>[] = [
  {
    accessorKey: 'product',
    id: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="hover:bg-muted hover:text-foreground"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Product
          <ArrowUpDown className="ml-2 h-4 min-h-[1rem] w-4 min-w-[1rem]" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const name = row.original.product.name;
      const id = row.original.id;
      return (
        <div className="ml-4">
          <Link
            href={`/admin/products/${id}`}
            className="font-medium text-primary hover:underline whitespace-nowrap"
          >
            {capitalizeFirstLetter(name)}
          </Link>
        </div>
      );
    },
  },
  {
    accessorKey: 'startDate',
    id: 'startDate',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="hover:bg-muted hover:text-foreground"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Start Date
          <ArrowUpDown className="ml-2 h-4 min-h-[1rem] w-4 min-w-[1rem]" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const startDate = row.original.startDate;
      return (
        <div className="ml-4">
          {new DateFormatter('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
          }).format(new Date(startDate))}
        </div>
      );
    },
  },
  {
    accessorKey: 'endDate',
    id: 'endDate',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="hover:bg-muted hover:text-foreground"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          End Date
          <ArrowUpDown className="ml-2 h-4 min-h-[1rem] w-4 min-w-[1rem]" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const endDate = row.original.endDate;
      return (
        <div className="ml-4">
          {new DateFormatter('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
          }).format(new Date(endDate))}
        </div>
      );
    },
  },
  {
    accessorKey: 'price',
    id: 'price',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="hover:bg-muted hover:text-foreground"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Discount Price
          <ArrowUpDown className="ml-2 h-4 min-h-[1rem] w-4 min-w-[1rem]" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const price = row.original.price;
      const formatted = new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'USD',
      }).format(price);
      return <div className="ml-4">{formatted}</div>;
    },
  },
  {
    accessorKey: 'originalPrice',
    id: 'originalPrice',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="hover:bg-muted hover:text-foreground"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Original Price
          <ArrowUpDown className="ml-2 h-4 min-h-[1rem] w-4 min-w-[1rem]" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const price = row.original.originalPrice;
      const formatted = new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'USD',
      }).format(price);
      return <div className="ml-4">{formatted}</div>;
    },
  },
  {
    id: 'status',
    header: ({ column }) => {
      return <div className="ml-4">Status</div>;
    },
    cell: ({ row }) => {
      const startDate = row.original.startDate;
      const endDate = row.original.endDate;
      // check if sale is active
      const isActive =
        new Date(startDate) < new Date() && new Date(endDate) > new Date();
      return <div className="ml-4">{isActive ? 'Active' : 'Ended'}</div>;
    },
  },
  {
    id: 'actions',
    header: () => {
      return <div className="flex justify-end">Actions</div>;
    },
    maxSize: 100,
    size: 50,
    cell: ({ row }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const router = useRouter();
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { toast } = useToast();
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { mutateAsync } = useMutation(deleteSale, {
        onSuccess: () => {
          router.refresh();
          toast({
            title: 'Success',
            description: 'Sale deleted successfully',
            variant: 'success',
          });
        },
        onError: (error) => {
          toast({
            title: 'Error',
            description: getErrorMessage(error),
            variant: 'destructive',
          });
        },
      });
      const id = row.original.id;
      const productId = row.original.productId;
      const action = () => {
        mutateAsync({ saleId: id, productId });
      };

      return (
        <DropdownMenu>
          <div className="mr-4 flex justify-end">
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex h-8 w-8 p-0">
                <span className="sr-only">Open the menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
          </div>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="cursor-pointer hover:bg-destructive/10 focus:bg-destructive/10 hover:text-destructive focus:text-destructive"
              onClick={action}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
