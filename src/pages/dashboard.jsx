/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import Modal from 'react-modal';
import { useState, useEffect } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { withAuth } from '../layouts/auth/Auth';

const customStyles = {
    overlay: {
        zIndex: 1000
    },
    content: {
        width: '80%',
        height: '80%',
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};

const validationSchemaCreateNewProduct = Yup.object({
    name: Yup.string().required(),
    price: Yup.number().required().min(0),
    imageurl: Yup.string().required()
});
const validationSchemaEditProduct = Yup.object({
    name: Yup.string(),
    price: Yup.number(),
    imageurl: Yup.string()
});
  
const initialValuesCreateNewProduct = {
    name: '',
    price: '',
    imageurl: ''
};

function Dashboard(){
    const sessionUser = () => {
        return (process.browser && localStorage.getItem('user')) ? JSON.parse(localStorage.getItem('user')) : 'undefined';
    }

    const [modalCreate, setModalCreate] = useState(false);
    const [modalEdit, setModalEdit] = useState(false);
    const [modalDelete, setModalDelete] = useState(false);

    const [messageCreate, setMessageCreate] = useState('');
    const [loadingCreate, setLoadingCreate] = useState(false);

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.clear();
        window.location.reload();
    };
    
    const [products, setProducts] = useState([]);
    const [productID, setProductID] = useState({});
    
    const initialValuesGetProduct = {
        name: productID.name,
        price: productID.price,
        imageurl: productID.imageurl
    };

    const getProducts = async () => {
        try {
            const response = await fetch(`https://test-binar.herokuapp.com/v1/products`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `${sessionUser().access_token}`
                }
            });
            const data = await response.json();

            if(response.status == 200){
                setProducts(data.result);
            }else{
                console.log(response.status); 
            }
        } catch (error) {
            console.log(error);
        }
    }
    
    useEffect(() => {
        getProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    const getProductbyID = async (id) => {
        try {
            const response = await fetch(`https://test-binar.herokuapp.com/v1/products/${id}`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `${sessionUser().access_token}`
                }
            });
            const data = await response.json();

            if(response.status == 200){
                setProductID(data.result);
            }else{
                console.log(response.status); 
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getProductbyID()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    async function handleGetProductByID(id){
        await getProductbyID(id);
    }

    async function handleOnSubmitCreateNewProduct(values){
        await createNewProduct(values);
    }

    const createNewProduct = async (payload) => {
        setLoadingCreate(true);
        try {
            const request = {
                "name": payload.name,
                "price": payload.price,
                "imageurl": payload.imageurl
            }
            const response = await fetch(`https://test-binar.herokuapp.com/v1/products/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${sessionUser().access_token}`
                },
                body: JSON.stringify(request)
            });
            const data = await response.json();
            console.log(response.status);
            console.log(data.result);
            
            if(response.status == 200){
                if(data.result == null){
                    setLoadingCreate(false);
                }else{
                    setLoadingCreate(false);
                    window.location.reload();
                }
            }else{
                console.log(response.status); 
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function handleOnSubmitUpdateProduct(values){
        let tempName = (values.name == null) ? productID.name : values.name;
        let tempPrice = (values.price == null) ? productID.price : values.price;
        let tempImageUrl = (values.imageurl == null) ? productID.imageurl : values.imageurl;
        const tempValue = {
            name: tempName,
            price: tempPrice,
            imageurl: tempImageUrl
        }
        await updateProduct(productID.id, tempValue);
    }

    const updateProduct = async (id,payload) => {
        setLoadingCreate(true);
        try {
            const request = {
                "name": payload.name,
                "price": payload.price,
                "imageurl": payload.imageurl
            }
            console.log(sessionUser().access_token);
            const response = await fetch(`https://test-binar.herokuapp.com/v1/products/${id}`, {
                method: 'put',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': sessionUser().access_token
                },
                body: JSON.stringify(request)
            });
            const data = await response.json();
            
            if(response.status == 200){
                if(data.result == null){
                    setLoadingCreate(false);
                }else{
                    setLoadingCreate(false);
                    window.location.reload();
                }
            }else{
                console.log(response.status); 
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function handleOnDeleteProduct(e){
        e.preventDefault();
        deleteProductbyID(productID.id)
    }

    const deleteProductbyID = async (id) => {
        setLoadingCreate(true);
        try {
            const response = await fetch(`https://test-binar.herokuapp.com/v1/products/${id}`, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': sessionUser().access_token
                }
            });
            const data = await response.json();
            console.log(response.status);

            if(response.status == 200){
                setLoadingCreate(false);
                window.location.reload();
            }else{
                console.log(response.status); 
            }
        } catch (error) {
            console.log(error);
        }
    }

    return(
    <>
        {/* NAVBAR */}
        <nav id="header" className="fixed w-full z-30 top-0 py-1 bg-white shadow-lg border-b border-blue-400 ">
            <div className="w-full flex items-center justify-between mt-0 px-6 py-2">
                <label htmlFor="menu-toggle" className="cursor-pointer md:hidden block">
                    <svg className="fill-current text-blue-600" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
                       <title>menu</title>
                       <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
                    </svg>
                </label>
                <input className="hidden" type="checkbox" id="menu-toggle"/>
                 
                <div className="hidden md:flex md:items-center md:w-auto w-full order-3 md:order-1" id="menu">
                    <nav>
                       <ul className="md:flex items-center justify-between text-base pt-4 md:pt-0">
                            <li>
                                <h3 className="font-medium text-blue-600 text-lg py-2 px-4 lg:-ml-2">Product List</h3>
                            </li>
                            <li>
                                <button className="bg-gray-200 font-bold py-2 px-4 rounded inline-flex items-center hover:bg-zinc-300" onClick={() => {setModalCreate(true);}}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                    <span className="ml-2">Create New</span>
                                </button>
                            </li>
                       </ul>
                    </nav>
                </div>
                 
                <div className="order-2 md:order-3 flex flex-wrap items-center justify-end mr-0 md:mr-4" id="nav-content">
                    <div className="auth flex items-center w-full md:w-full">
                        <span 
                            className="bg-transparent text-gray-800  p-2 rounded border border-gray-300 mr-4 hover:bg-gray-100 hover:text-gray-700 cursor-pointer" 
                            onClick={(e) => handleLogout(e)}
                        >
                            Logout
                        </span>
                    </div>
                </div>
            </div>
        </nav>

        {/* List Product */}
        {
            (products.length > 0) && (
            <div className="min-h-screen bg-gray-100 flex flex-col justify-center">
                <div className="relative m-20 flex flex-wrap mx-auto justify-center">
                {
                products.map(product => (
                    <div key={product.id} className="relative max-w-sm min-w-[340px] bg-white shadow-md rounded-3xl p-2 mx-1 my-3">
                        <div className="overflow-x-hidden rounded-2xl relative">
                            <img className="h-40 rounded-2xl w-full object-cover" src={product.imageurl} />
                            {/* edit product */}
                            <p className="absolute right-14 top-2 bg-white rounded-full p-2 cursor-pointer group hover:bg-zinc-300" onClick={() => {setModalEdit(true);handleGetProductByID(product.id);}}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                </svg>
                            </p>
                            {/* delete product */}
                            <p className="absolute right-2 top-2 bg-white rounded-full p-2 cursor-pointer group hover:bg-zinc-300" onClick={() => {setModalDelete(true);handleGetProductByID(product.id);}}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                </svg>
                            </p>
                        </div>
                        <div className="mt-4 pl-2 mb-2 flex justify-between ">
                            <div>
                                <p className="text-lg font-semibold text-gray-900 mb-0">{product.name}</p>
                                <p className="text-md text-gray-800 mt-0">$ {product.price}</p>
                            </div>
                        </div>
                    </div>
                ))
                }
                </div>
            </div>
            )
        }

        {/* create new */}
        <Modal
            isOpen={modalCreate}
            onRequestClose={() => {setModalCreate(false);setLoadingCreate(false);}}
            style={customStyles}
            contentLabel="Example Modal"
        >
            <div className="container mx-auto px-1 py-1 ">
                <div className="max-w-lg mx-auto">
                    <h3 className="font-medium flex justify-center text-3xl mb-8">Create New</h3>
                    <Formik
                        initialValues={initialValuesCreateNewProduct}
                        validationSchema={validationSchemaCreateNewProduct}
                        onSubmit={handleOnSubmitCreateNewProduct}
                    >{({
                        handleSubmit,
                        handleChange,
                        handleBlur,
                        touched,
                        errors,
                    }) => (
                        <form 
                            onSubmit={handleSubmit}
                        >
                                {/* form Create New Product */}
                                <div className="mt-4">
                                    <input type="text" className="w-full py-3 px-2 border border-gray-200 rounded-md" 
                                        name="name" 
                                        id="name" 
                                        onChange={handleChange} 
                                        onBlur={handleBlur}
                                        placeholder="Product Name" 
                                    />
                                </div>
                                <div className={`box-border ${touched.name && errors.name ? 'mb-2 text-red-500 text-sm font-bold block' : ''}`}>
                                    {touched.name && errors.name && errors.name}
                                </div>
                                <div className="mt-4">
                                    <input type="number" className="w-full py-3 px-2 border border-gray-200 rounded-md" 
                                        name="price" 
                                        id="price" 
                                        onChange={handleChange} 
                                        onBlur={handleBlur}
                                        placeholder="Price (Dollar USD)" 
                                    />
                                </div>
                                <div className={`box-border ${touched.price && errors.price ? 'mb-2 text-red-500 text-sm font-bold block' : ''}`}>
                                    {touched.price && errors.price && errors.price}
                                </div>
                                <div className="mt-4">
                                    <input type="text" className="w-full py-3 px-2 border border-gray-200 rounded-md" 
                                        name="imageurl" 
                                        id="imageurl" 
                                        onChange={handleChange} 
                                        onBlur={handleBlur}
                                        placeholder="Image URL" 
                                    />
                                </div>
                                <div className={`box-border ${touched.imageurl && errors.imageurl ? 'mb-2 text-red-500 text-sm font-bold block' : ''}`}>
                                    {touched.imageurl && errors.imageurl && errors.imageurl}
                                </div>
                                <div className="my-4 flex flex-row-reverse">
                                    <button type="submit" className="w-1/5 text-white justify-center border bg-blue-500 px-5 py-2 w-1/2 rounded-md" disabled={loadingCreate}>
                                        {loadingCreate ? 'Please wait...':'Create'}
                                    </button>
                                    <span className="cursor-pointer w-1/5 mr-2 text-gray-700 justify-center border bg-white px-5 py-2 w-1/2 rounded-md" onClick={() => {setModalCreate(false);setLoadingCreate(false);}}>
                                        Back
                                    </span>
                                </div>
                        </form>
                    )}
                    </Formik>
                </div>
            </div>
        </Modal>

        {/* edit product => get ID */}
        <Modal
            isOpen={modalEdit}
            onRequestClose={() => {setModalEdit(false);setLoadingCreate(false);setProductID({});}}
            style={customStyles}
            contentLabel="Example Modal"
        >
            <div className="container mx-auto px-1 py-1 ">
                <div className="max-w-lg mx-auto">
                    <h3 className="font-medium flex justify-center text-3xl mb-8">Edit Product</h3>
                    <Formik
                        initialValues={initialValuesGetProduct}
                        validationSchema={validationSchemaEditProduct}
                        onSubmit={handleOnSubmitUpdateProduct}
                    >{({
                        handleSubmit,
                        handleChange,
                        handleBlur,
                        touched,
                        errors,
                    }) => (
                        <form 
                            onSubmit={handleSubmit}
                        >
                            {/* form Edit Product */}
                            <div className="mt-4">
                                <input type="text" className="w-full py-3 px-2 border border-gray-200 rounded-md" 
                                    name="name" 
                                    id="name" 
                                    onChange={handleChange} 
                                    onBlur={handleBlur}
                                    placeholder="Product Name"
                                    defaultValue={productID.name} 
                                />
                            </div>
                            <div className={`box-border ${touched.name && errors.name ? 'mb-2 text-red-500 text-sm font-bold block' : ''}`}>
                                {touched.name && errors.name && errors.name}
                            </div>
                            <div className="mt-4">
                                <input type="number" className="w-full py-3 px-2 border border-gray-200 rounded-md" 
                                    name="price" 
                                    id="price" 
                                    onChange={handleChange} 
                                    onBlur={handleBlur}
                                    placeholder="Price (Dollar USD)" 
                                    defaultValue={productID.price} 
                                />
                            </div>
                            <div className={`box-border ${touched.price && errors.price ? 'mb-2 text-red-500 text-sm font-bold block' : ''}`}>
                                {touched.price && errors.price && errors.price}
                            </div>
                            <div className="mt-4">
                                <input type="text" className="w-full py-3 px-2 border border-gray-200 rounded-md" 
                                    name="imageurl" 
                                    id="imageurl" 
                                    onChange={handleChange} 
                                    onBlur={handleBlur}
                                    placeholder="Image URL" 
                                    defaultValue={productID.imageurl} 
                                />
                            </div>
                            <div className={`box-border ${touched.imageurl && errors.imageurl ? 'mb-2 text-red-500 text-sm font-bold block' : ''}`}>
                                {touched.imageurl && errors.imageurl && errors.imageurl}
                            </div>
                            <div className="my-4 flex flex-row-reverse">
                                <button type="submit" className="w-1/5 text-white justify-center border bg-blue-500 px-5 py-2 w-1/2 rounded-md" disabled={loadingCreate}>
                                    {loadingCreate ? 'Please wait...':'Update'}
                                </button>
                                <span className="cursor-pointer w-1/5 mr-2 text-gray-700 justify-center border bg-white px-5 py-2 w-1/2 rounded-md" onClick={() => {setModalEdit(false);setLoadingCreate(false);setProductID({});}}>
                                    Back
                                </span>
                            </div>
                        </form>
                    )}
                    </Formik>
                </div>
            </div>
        </Modal>

        {/* delete product => get ID */}
        <Modal
            isOpen={modalDelete}
            onRequestClose={() => {setModalDelete(false);setLoadingCreate(false);setProductID({});}}
            style={customStyles}
            contentLabel="Example Modal"
        >
            <div className="container mx-auto px-1 py-1 ">
                <div className="max-w-lg mx-auto">
                    <h3 className="font-medium flex justify-center text-3xl mt-10">Are you sure want to delete</h3>
                    <h5 className="font-medium flex justify-center text-3xl mb-10">{productID.name} ?</h5>
                        <div className="my-4 flex flex-row-reverse">
                            <button
                                className="w-1/2 text-white justify-center border bg-blue-500 px-5 py-2 w-1/2 rounded-md"
                                onClick={handleOnDeleteProduct}
                            >
                                {loadingCreate ? 'Please wait...':'Delete'}
                            </button>
                            <span className="cursor-pointer w-1/2 mr-2 text-gray-700 justify-center border bg-white px-5 py-2 w-1/2 rounded-md" onClick={() => {setModalDelete(false);setLoadingCreate(false);setProductID({});}}>
                                Back
                            </span>
                        </div>
                </div>
            </div>
        </Modal>

    </>
    )
}

export default withAuth(Dashboard);