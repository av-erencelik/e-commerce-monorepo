'use client';
import { Product } from '@client/types/column';
import { Button, useToast } from '@e-commerce-monorepo/ui';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@e-commerce-monorepo/ui';
import { capitalizeFirstLetter, getErrorMessage } from '@client/lib/utils';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { deleteProduct } from '@client/lib/api/api-service';

export const productsColumn: ColumnDef<Product>[] = [
  {
    accessorKey: 'name',
    id: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="hover:bg-muted hover:text-foreground"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 min-h-[1rem] w-4 min-w-[1rem]" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const name = row.original.name;
      const id = row.original.id;
      return (
        <div className="ml-4">
          <Link
            href={`/admin/products/${id}`}
            className="font-medium text-primary hover:underline"
          >
            {capitalizeFirstLetter(name)}
          </Link>
        </div>
      );
    },
  },
  {
    accessorKey: 'stock',
    id: 'product stock',
    header: () => {
      return <div className="ml-4">Stock</div>;
    },
    cell: ({ row }) => {
      const stock = row.original.stock;
      return <div className="w-20 text-center">{stock}</div>;
    },
  },
  {
    accessorKey: 'dailySales',
    id: 'product daily sales',
    header: () => {
      return <div className="ml-4">Daily Sales</div>;
    },
    cell: ({ row }) => {
      const dailySales = row.original.dailySales;
      return <div className="w-20 text-center">{dailySales}</div>;
    },
  },
  {
    accessorKey: 'weight',
    id: 'product weight',
    header: () => {
      return <div className="ml-4">Weight</div>;
    },
    cell: ({ row }) => {
      const weight = row.original.weight;
      return (
        <div className="w-20 text-center">{weight || 'Not specified'}</div>
      );
    },
  },
  {
    accessorKey: 'category',
    id: 'product category',
    header: () => {
      return <div className="ml-4">Category</div>;
    },
    cell: ({ row }) => {
      const category = row.original.category;
      return <div className="w-20 text-center">{category.name}</div>;
    },
  },
  {
    accessorKey: 'price',
    id: 'product price',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="hover:bg-muted hover:text-foreground"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Price
          <ArrowUpDown className="ml-2 h-4 min-h-[1rem] w-4 min-w-[1rem]" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const price = row.original.price[0] ? row.original.price[0].price : 0;
      const formatted = new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'USD',
      }).format(price);
      return <div className="w-20 text-center">{formatted}</div>;
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
      const { mutateAsync } = useMutation(deleteProduct, {
        onSuccess: () => {
          router.refresh();
          toast({
            title: 'Success',
            description: 'Product deleted successfully',
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
      const action = () => {
        mutateAsync(id);
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
            <DropdownMenuItem className="cursor-pointer" asChild>
              <Link href={`/admin/products/${id}`}>Review</Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" asChild>
              <Link href={`/admin/products/${id}/edit`}>Edit</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
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
