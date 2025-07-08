import { useState } from "react";
import BookTable from "../components/book/book.table";

const BookPage = () => {
    const [dataBooks, setDataBooks] = useState([]);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [total, setTotal] = useState(0);
    const [loadingTable, setLoadingTable] = useState(false);

    return (
        <>
            <div style={{ padding: "20px" }}>
                <BookTable
                    dataBooks={dataBooks}
                    setDataBooks={setDataBooks}
                    current={current}
                    pageSize={pageSize}
                    total={total}
                    setTotal={setTotal}
                    setCurrent={setCurrent}
                    setPageSize={setPageSize}
                    loadingTable={loadingTable}
                    setLoadingTable={setLoadingTable}
                />
            </div>
        </>
    );
}
export default BookPage;