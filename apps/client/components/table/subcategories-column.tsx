'use client';
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
import { ProductSubcategoryColumn } from '@client/types/column';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { deleteSubcategory } from '@client/lib/api/api-service';

export const categoriesColumn: ColumnDef<ProductSubcategoryColumn>[] = [
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
            href={`categories/${id}`}
            className="font-medium text-primary hover:underline whitespace-nowrap"
          >
            {capitalizeFirstLetter(name)}
          </Link>
        </div>
      );
    },
  },
  {
    accessorKey: 'description',
    id: 'description',
    header: () => {
      return (
        <div className="md:w-72 sm:w-40 text-center w-20">Description</div>
      );
    },
    cell: ({ row }) => {
      const description = row.original.description;
      return (
        <div className="md:w-72 sm:w-40 w-20 text-center truncate">
          {description}
        </div>
      );
    },
  },
  {
    accessorKey: 'category',
    id: 'category',
    header: () => {
      return <div className="ml-4">Category</div>;
    },
    cell: ({ row }) => {
      const category = row.original.category;
      const categoryName = capitalizeFirstLetter(category.name);
      return <div className="w-20 text-center">{categoryName}</div>;
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
      const { mutateAsync } = useMutation(deleteSubcategory, {
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
              <Link href={`/admin/categories/${id}`}>Review</Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" asChild>
              <Link href={`/admin/categories/${id}/edit`}>Edit</Link>
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
