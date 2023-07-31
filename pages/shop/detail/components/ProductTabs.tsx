import { FC, useState, Fragment } from 'react'

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { getTypeShop } from '@/types';
import AppPagination from './AppPagination';
import { BsBox2Fill, BsFillStarFill } from 'react-icons/bs';
import { FaStore } from 'react-icons/fa';
interface ProductListProps {
    getShop: getTypeShop
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const ProductTabs: FC<ProductListProps> = ({ getShop }) => {
    const [value, setValue] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    return <>
        <div className='hidden lg:block'>
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        <Tab label="Beranda" className='font-bold' {...a11yProps(0)} />
                        <Tab label="Produk" className='font-bold' {...a11yProps(1)} />
                        <Tab label="Ulasan" className='font-bold' {...a11yProps(2)} />
                    </Tabs>
                </Box>
                <CustomTabPanel value={value} index={0}>
                    Item One
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                    <AppPagination getShop={getShop} />
                </CustomTabPanel>
                <CustomTabPanel value={value} index={2}>
                    Item Three
                </CustomTabPanel>
            </Box>
        </div>
        <div className='lg:hidden'>
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        <Tab icon={<FaStore className='w-6 h-6' />} className='font-bold' {...a11yProps(0)} />
                        <Tab icon={<BsBox2Fill className='w-5 h-5' />} className='font-bold' {...a11yProps(1)} />
                        <Tab icon={<BsFillStarFill className='w-5 h-5 active:text-yellow-700 focus:ring focus:ring-yellow-700 focus:text-yellow-700' />} className='font-bold' {...a11yProps(2)} />
                    </Tabs>
                </Box>
                <CustomTabPanel value={value} index={0}>
                    Item One
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                    <AppPagination getShop={getShop} />
                </CustomTabPanel>
                <CustomTabPanel value={value} index={2}>
                    Item Three
                </CustomTabPanel>
            </Box>
        </div>
    </>
}

export default ProductTabs