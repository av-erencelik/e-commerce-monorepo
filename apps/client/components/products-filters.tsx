'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  cn,
} from '@e-commerce-monorepo/ui';
import { useCallback, useTransition } from 'react';
import {
  ChevronDownIcon,
  TextAlignBottomIcon,
  TextAlignTopIcon,
} from '@radix-ui/react-icons';
import { ProductSubCategory } from '@client/types';

const ProductFilters = ({
  subcategories,
}: {
  subcategories: ProductSubCategory[];
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const subcategory_id = searchParams?.get('subcategory') ?? '';
  const sort_by = searchParams?.get('sort_by') ?? 'created_at';
  const order = searchParams?.get('order') ?? 'desc';

  const createQueryString = useCallback(
    (params: Record<string, string | number | null>) => {
      const newSearchParams = new URLSearchParams(searchParams?.toString());

      for (const [key, value] of Object.entries(params)) {
        if (value === null) {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, String(value));
        }
      }

      return newSearchParams.toString();
    },
    [searchParams]
  );
  return (
    <div className="flex items-center justify-between">
      <div className="space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              aria-label="Select subcategory"
              size="sm"
              disabled={isPending}
            >
              Subcategory
              <ChevronDownIcon className="ml-2 h-4 w-4" aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuLabel>Subcategory</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {subcategories.map((subcategory) => (
              <DropdownMenuItem
                key={subcategory.id}
                onSelect={() => {
                  startTransition(() => {
                    router.push(
                      `${pathname}?${createQueryString({
                        page: null,
                        subcategory: subcategory.id,
                      })}`,
                      {
                        scroll: false,
                      }
                    );
                  });
                }}
                className={cn('text-sm', {
                  'font-bold text-accent-foreground':
                    subcategory.id.toString() === subcategory_id,
                })}
                disabled={isPending}
              >
                {subcategory.name}
              </DropdownMenuItem>
            ))}
            <DropdownMenuItem
              onSelect={() => {
                startTransition(() => {
                  router.push(
                    `${pathname}?${createQueryString({
                      page: null,
                      subcategory: null,
                    })}`,
                    {
                      scroll: false,
                    }
                  );
                });
              }}
              className={cn('text-sm', {
                'font-bold text-accent-foreground': subcategory_id === '',
              })}
              disabled={isPending}
            >
              All
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-label="Select Sort" size="sm" disabled={isPending}>
              Sort
              <ChevronDownIcon className="ml-2 h-4 w-4" aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>Sort by</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => {
                startTransition(() => {
                  router.push(
                    `${pathname}?${createQueryString({
                      page: null,
                      sort_by: 'created_at',
                    })}`,
                    {
                      scroll: false,
                    }
                  );
                });
              }}
              className={cn('text-sm', {
                'font-bold text-accent-foreground': sort_by === 'created_at',
              })}
              disabled={isPending}
            >
              Date
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                startTransition(() => {
                  router.push(
                    `${pathname}?${createQueryString({
                      page: null,
                      sort_by: 'price',
                    })}`,
                    {
                      scroll: false,
                    }
                  );
                });
              }}
              className={cn('text-sm', {
                'font-bold text-accent-foreground': sort_by === 'price',
              })}
              disabled={isPending}
            >
              Price
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Button
        size="sm"
        aria-label="order"
        variant="secondary"
        disabled={isPending}
        onClick={() => {
          startTransition(() => {
            router.push(
              `${pathname}?${createQueryString({
                page: null,
                order: order === 'desc' ? 'asc' : 'desc',
              })}`,
              {
                scroll: false,
              }
            );
          });
        }}
      >
        {order === 'desc' ? (
          <TextAlignBottomIcon className="h-4 w-4 mb-1" />
        ) : (
          <TextAlignTopIcon className="h-4 w-4 mt-1" />
        )}
      </Button>
    </div>
  );
};

export default ProductFilters;
