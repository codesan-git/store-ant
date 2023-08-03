import { Card, CardActionArea, CardContent, CardMedia, Grid, Pagination, Stack, Typography } from '@mui/material';
import { FC, forwardRef, useState } from 'react';
import { getTypeShop } from '@/types';
import { AiFillStar } from 'react-icons/ai'
import { FaFilter } from 'react-icons/fa'

import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import List from '@mui/material/List';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';

import Chip from '@mui/material/Chip';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';

import { Shop, Product } from '@prisma/client'

interface AppPaginationProps {
  getShop: Shop & {
    product: Product[]
  }
}

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AppPagination: FC<AppPaginationProps> = ({ getShop }) => {
  const itemsPerPage = 5;
  const totalPages = Math.ceil(getShop?.product.length / itemsPerPage);
  const [currentPage, setCurrentPage] = useState(1);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [sortType, setSortType] = useState('ASCENDING');
  const [openModal, setOpenModal] = useState(false);
  const [alignment, setAlignment] = useState('web');



  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const sortedData = sortType === "DESCENDING"
      ? getShop?.product?.slice().sort((a, b) => b.price - a.price)
      : getShop?.product?.slice().sort((a, b) => a.price - b.price);

    return sortedData?.slice(startIndex, endIndex);
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string,
  ) => {
    setAlignment(newAlignment);
  };

  const handleSortChange = (sortType: string) => {
    setSortType(sortType);
    setCurrentPage(1);
    handleClose();
  };

  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  });


  console.log(`getshop`, getShop)
  return (<>
    <div id='product-desktop' className='hidden lg:block'>
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
    <div id='product-mobile' className='lg:hidden'>
      <div>
        <Button variant="outlined" className='border-gray-600 text-gray-600 rounded-full mt-2 btn-sm capitalize' onClick={handleClickOpenModal}>
          <FaFilter className='text-gray-600' /> Filter
        </Button>
        <Dialog
          fullScreen
          open={openModal}
          onClose={handleCloseModal}
          TransitionComponent={Transition}
          PaperProps={{
            sx: {
              maxHeight: "50%",
              bottom: 0,
              marginTop: "auto",
              borderTopRightRadius: "20px",
              borderTopLeftRadius: "20px"
            }
          }}
        >
          <Typography variant='h6' className='font-bold ml-4 mt-4'>
            Filter
          </Typography>
          <List>
            <Typography variant='h6' className='font-bold ml-4 mt-4'>
              Urutkan
            </Typography>
            <Grid container spacing={1} className='ml-1 mt-1'>
              <Grid item>
                <Chip
                  label="Harga Terendah"
                  variant='outlined'
                  onClick={() => {
                    handleSortChange("ASCENDING")
                    handleCloseModal()
                  }}
                  className='border border-gray-600 rounded-full'
                />
              </Grid>
              <Grid item>
                <Chip
                  label="Harga Tertinggi"
                  variant='outlined'
                  onClick={() => {
                    handleSortChange("DESCENDING")
                    handleCloseModal()
                  }}
                  className='border border-gray-600 rounded-full'
                />
              </Grid>
            </Grid>
          </List>
        </Dialog>
      </div>
      <div className='flex justify-between my-2'>
        <h5 className='text-gray-600 my-auto'>{getShop?.product.length.toString()} Produk</h5>
        <Box >
          <ToggleButtonGroup
            color="primary"
            value={alignment}
            exclusive
            onChange={handleChange}
            aria-label="Platform"
            size='small'
          >
            <ToggleButton value="web"><ViewModuleIcon /></ToggleButton>
            <ToggleButton value="android"><ViewListIcon /></ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </div>
      {alignment === "web" ?
        <>
          <div className='grid grid-cols-2 gap-2' >
            {getCurrentPageData().map((product) => (
              <div key={product.id}>
                <Card sx={{ height: 275 }} className='flex rounded-lg'>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      image={`${product.image}`}
                      alt={`${product.name}`}
                      className='h-1/2'
                    />
                    <CardContent className='relative h-1/2'>
                      <Typography gutterBottom variant="h5" component="div">
                        <p className='text-sm'>{product.name}</p>
                      </Typography>
                      <Typography variant="body2" color="black">
                        <p className='font-bold text-lg'>{formatter.format(product.price).toString()}</p>
                      </Typography>
                      <Typography variant='body2'>
                        <div className='flex'>
                          <AiFillStar
                            className='text-yellow-700 w-3 h-3 my-auto'
                          />
                          <h3 className='ml-1 align-bottom text-sm'>{product.averageRating}</h3>
                          <div className='divider divider-horizontal mx-[-3px]'></div>
                          <h3 className='align-bottom text-sm'>Terjual 80+</h3>
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
        </>
        :
        <>
          <div className='gap-2' >
            {getCurrentPageData().map((product) => (
              <div key={product.id}>
                <Card sx={{}} className='flex rounded-lg justify-start mb-2'>
                  <CardActionArea
                    className='flex my-2 relative w-full'
                  >
                    <CardMedia
                      component="img"
                      image={`${product.image}`}
                      alt={`${product.name}`}
                      className='h-32 w-32 rounded-lg'
                    />
                    <CardContent className='relative'>
                      <Typography gutterBottom variant="h5" component="div">
                        <p className='text-sm'>{product.name}</p>
                      </Typography>
                      <Typography variant="body2" color="black">
                        <p className='font-bold text-lg'>{formatter.format(product.price).toString()}</p>
                      </Typography>
                      <Typography variant='body2'>
                        <div className='flex'>
                          <AiFillStar
                            className='text-yellow-700 w-3 h-3 my-auto'
                          />
                          <h3 className='ml-1 align-bottom text-sm'>{product.averageRating}</h3>
                          <div className='divider divider-horizontal mx-[-3px]'></div>
                          <h3 className='align-bottom text-sm'>Terjual 80+</h3>
                        </div>
                      </Typography>
                    </CardContent>
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
                  </CardActionArea>
                </Card>
              </div>
            ))}
          </div>
        </>
      }
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
  </>
  );
};

export default AppPagination;
