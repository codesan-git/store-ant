import { Card, CardActionArea, CardContent, CardMedia, Pagination, Stack, Typography } from '@mui/material';
import { FC, useState } from 'react';
import { getTypeShop } from '@/types';
import { AiFillStar } from 'react-icons/ai'

import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

interface AppPaginationProps {
  getShop: getTypeShop;
}

// enum SortType {
//   ASCENDING = "ascending",
//   DESCENDING = "descending",
// }

const AppPagination: FC<AppPaginationProps> = ({ getShop }) => {
  const itemsPerPage = 10;
  const totalPages = Math.ceil(getShop.product.length / itemsPerPage);
  const [currentPage, setCurrentPage] = useState(1);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  // const [sortType, setSortType] = useState<SortType>(SortType.ASCENDING);
  const [sortType, setSortType] = useState('ASCENDING');


  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // Jika sortType adalah descending, maka urutkan datanya secara menurun (berdasarkan harga)
    // const sortedData = sortType === SortType.DESCENDING
    const sortedData = sortType === "DESCENDING"
      ? getShop.product.slice().sort((a, b) => b.price - a.price)
      : getShop.product.slice().sort((a, b) => a.price - b.price);

    return sortedData.slice(startIndex, endIndex);
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // const handleSortChange = (type: SortType) => {
    const handleSortChange = (sortType :string) => {
    setSortType(sortType);
    setCurrentPage(1); // Set halaman kembali ke halaman pertama setelah mengubah pengurutan
    handleClose(); // Tutup menu dropdown setelah mengubah pengurutan
  };

  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  });


  return (
    <div className='p-0'>
      <h1 className='text-2xl font-bold mb-4'>Semua Produk</h1>
      <Box sx={{ minWidth: 120, display: 'flex', marginBottom: 5, justifyContent: 'end' }}>
        <h3 className='text-xl font-bold my-auto mr-4'>Urutkan</h3>
        <FormControl sx={{ width: 180 }} size='small'>
          <InputLabel id="demo-simple-select-label">Sorting</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={sortType}
            label="Sorting"
            onChange={(e: any) => handleSortChange(e.target.value)}
          >
            <MenuItem value="ASCENDING">Harga Terendah</MenuItem>
            <MenuItem value="DESCENDING">Harga Tertinggi</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <div className='grid grid-cols-5 gap-2'>
        {getCurrentPageData().map((product) => (
          <div key={product.id}>
            <Card sx={{ height: 350 }} className='flex rounded-lg'>
              <CardActionArea>
                <CardMedia
                  component="img"
                  image={`${product.image}`}
                  alt={`${product.name}`}
                  className='h-1/2'
                />
                <CardContent className='relative h-1/2'>
                  <Typography gutterBottom variant="h5" component="div">
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="black">
                    <p className='font-bold text-xl'>{formatter.format(product.price).toString()}</p>
                  </Typography>
                  <Typography variant='body2'>
                    <div className='flex my-2'>
                      <AiFillStar
                        className='text-yellow-700 w-5 h-5 my-auto'
                      />
                      <h3 className='ml-1 align-bottom text-lg'>{product.averageRating}</h3>
                      <div className='divider divider-horizontal mx-[-3px]'></div>
                      <h3 className='align-bottom text-lg'>Terjual 80+</h3>
                    </div>
                  </Typography>
                  <Typography variant='button' position={"absolute"} className='right-0 bottom-0'>
                    <IconButton
                      aria-label="more"
                      id="long-button"
                      aria-controls={open ? 'long-menu' : undefined}
                      aria-expanded={open ? 'true' : undefined}
                      aria-haspopup="true"
                      onClick={handleClick}
                    >
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      id="long-button"
                      anchorEl={anchorEl}
                      open={open}
                      onClose={handleClose}
                      MenuListProps={{
                        'aria-labelledby': 'basic-button',
                      }}
                    >
                      <MenuItem onClick={handleClose}>Simpan Ke Wishlist</MenuItem>
                    </Menu>
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </div>
        ))}
      </div>
      <Stack direction="row" justifyContent="center" alignItems="center" spacing={2} className='my-8'>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(event, page) => setCurrentPage(page)}
          color="primary"
          shape='rounded'
          variant='outlined'
        />
      </Stack>
    </div>
  );
};

export default AppPagination;
