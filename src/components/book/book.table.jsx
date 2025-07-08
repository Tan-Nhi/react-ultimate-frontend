import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, message, Modal, notification, Popconfirm, Table } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import BookDetail from './book.detail';
import CreateBookController from './create.book.controller';
import CreateBookUncontrol from './create.book.uncontrol';
import UpdateBookController from './update.book.controller';
import UpdateBookUncontrol from './update.book.uncontrol';
import { deleteBookAPI, fetchAllBookAPI } from '../../services/api.service';


const BookTable = (props) => {

    const { dataBooks, setDataBooks,
        current, pageSize,
        total, setTotal,
        setCurrent, setPageSize,
        loadingTable, setLoadingTable
    } = props;

    const [dataDetail, setDataDetail] = useState(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const [isUpdateOpen, setIsUpdateOpen] = useState(false);
    const [dataUpdate, setDataUpdate] = useState(null);

    const loadBook = useCallback(async () => {
        setLoadingTable(true)
        const res = await fetchAllBookAPI(current, pageSize);
        if (res.data) {
            setDataBooks(res.data.result);
            setCurrent(res.data.meta.current);
            setPageSize(res.data.meta.pageSize);
            setTotal(res.data.meta.total);
        }
        setLoadingTable(false)
    }, [current, pageSize]);

    useEffect(() => { //side effect
        loadBook();
    }, [loadBook]); //[] + condition

    const columns = [
        {
            title: "STT",
            render: (_, record, index) => {
                return (
                    <>{(index + 1) + (current - 1) * pageSize}</>
                )
            }
        },
        {
            title: 'Id',
            dataIndex: '_id',
            render: (_, record) => {
                return (
                    <a
                        href='#'
                        onClick={() => {
                            setDataDetail(record);
                            setIsDetailOpen(true);
                        }}
                    >{record._id}</a>
                )
            }
        },
        {
            title: 'Tiêu đề',
            dataIndex: 'mainText',
        },
        {
            title: 'Giá tiền',
            dataIndex: 'price',
            render: (text, record, index, action) => {
                if (text)
                    return new Intl.NumberFormat('vi-VN',
                        { style: "currency", currency: 'VND' }).format(text)
            },
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
        },
        {
            title: 'Tác giả',
            dataIndex: 'author',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <div style={{ display: "flex", gap: "20px" }}>
                    <EditOutlined
                        onClick={() => {
                            setIsUpdateOpen(true);
                            setDataUpdate(record);
                        }}
                        style={{ cursor: "pointer", color: "orange" }} />
                    <Popconfirm
                        title="Xóa Book "
                        description="Bạn chắc chắn xóa book này ?"
                        onConfirm={() => handleDeleteUser(record._id)}
                        okText="Yes"
                        cancelText="No"
                        placement="left"
                    >
                        <DeleteOutlined style={{ cursor: "pointer", color: "red" }} />
                    </Popconfirm>
                </div>
            ),
        },
    ];

    const onChange = (pagination, filters, sorter, extra) => {
        // setCurrent, setPageSize
        //nếu thay đổi trang : current
        if (pagination && pagination.current) {
            if (+pagination.current !== +current) {
                setCurrent(+pagination.current) //"5" => 5
            }
        }

        //nếu thay đổi tổng số phần tử : pageSize
        if (pagination && pagination.pageSize) {
            if (+pagination.pageSize !== +pageSize) {
                setPageSize(+pagination.pageSize) //"5" => 5
            }
        }
    };

    const handleDeleteUser = async (id) => {
        const res = await deleteBookAPI(id);
        if (res.data) {
            message.success('Xóa book thành công');
            await loadBook();

        } else {
            message.error('Xóa book thất bại')
        }
    }


    return (
        <>
            <div style={{
                margin: "10px 0",
                display: "flex",
                justifyContent: "space-between"
            }}>
                <h3>Table Book</h3>
                {/* <CreateBookController
                    loadBook={loadBook}
                    isCreateOpen={isCreateOpen}
                    setIsCreateOpen={setIsCreateOpen}
                /> */}

                <CreateBookUncontrol
                    loadBook={loadBook}
                    isCreateOpen={isCreateOpen}
                    setIsCreateOpen={setIsCreateOpen}
                />


                {/* <UpdateBookController
                    loadBook={loadBook}
                    isUpdateOpen={isUpdateOpen}
                    setIsUpdateOpen={setIsUpdateOpen}
                    dataUpdate={dataUpdate}
                    setDataUpdate={setDataUpdate}
                /> */}

                <UpdateBookUncontrol
                    loadBook={loadBook}
                    isUpdateOpen={isUpdateOpen}
                    setIsUpdateOpen={setIsUpdateOpen}
                    dataUpdate={dataUpdate}
                    setDataUpdate={setDataUpdate}
                />
            </div>
            <Table
                columns={columns}
                dataSource={dataBooks}
                rowKey={"_id"}
                pagination={
                    {
                        current: current,
                        pageSize: pageSize,
                        showSizeChanger: true,
                        total: total,
                        showTotal: (total, range) => { return (<div> {range[0]}-{range[1]} trên {total} rows</div>) }
                    }
                }
                onChange={onChange}
                loading={loadingTable}
            />

            <BookDetail
                dataDetail={dataDetail}
                setDataDetail={setDataDetail}
                isDetailOpen={isDetailOpen}
                setIsDetailOpen={setIsDetailOpen}
                loadBook={loadBook}
            />


        </>
    );
}

export default BookTable