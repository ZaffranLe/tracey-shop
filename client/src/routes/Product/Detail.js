import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import productApi from '../../requests/ProductRequest';
import {
  classNames,
  formatVndCurrency,
  getImageUrl,
} from '../../helpers/Common';
import Slider from 'react-slick';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ProductItem } from '../../components';
import { useDispatch, useSelector } from 'react-redux';
import ReviewSection from './ReviewSection';
import CommentSection from './CommentSection';
import * as cartActions from '../../stores/cartReducer';

function ProductDetail(props) {
  const SECTION = {
    REVIEW: 'review',
    COMMENT: 'comment',
  };
  const MAX_RATING = 5;
  const [loading, setLoading] = React.useState(true);
  const [product, setProduct] = React.useState(null);
  const [activeSection, setActiveSection] = React.useState(SECTION.REVIEW);
  const [suggestProducts, setSuggestProducts] = React.useState([]);
  const {
    profile: { info: user },
  } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const params = useParams();
  const carouselRef = React.useRef(null);
  const [ratingIcons, setRatingIcons] = React.useState([]);

  const avgRating = React.useMemo(() => {
    if (product) {
      let _avgRating = (
        product.reviews.reduce(
          (rating, review) => (rating += review.rating),
          0,
        ) / product.reviews.length || 0
      ).toFixed(2);
      let stars = _avgRating;
      const _ratingIcons = [];
      while (stars >= 1) {
        stars -= 1;
        _ratingIcons.push('fa-star');
      }
      while (stars >= 0.5) {
        stars -= 0.5;
        _ratingIcons.push('fa-star-half-alt');
      }
      for (let i = 0; i < MAX_RATING - Math.round(_avgRating); i++) {
        _ratingIcons.push('far fa-star');
      }
      setRatingIcons(_ratingIcons);
      return _avgRating;
    }
    return 0;
  }, [product]);

  // <<<<<<< fix/responsive-ui
  const fetchProduct = async (id) => {
    try {
      setLoading(true);
      const productResp = await productApi.getProductById(id);
      const _product = productResp.data;
      const reviewsResp = await productApi.getProductReview(_product._id);
      _product.reviews = reviewsResp.data;
      setProduct(_product);
    } catch (e) {
      toast.error(
        e.response?.data?.error?.message ||
          'L???y th??ng tin s???n ph???m th???t b???i! Vui l??ng th??? l???i sau.',
      );
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  // =======
  //     const fetchProduct = async (id) => {
  //         try {
  //             setLoading(true);
  //             const productResp = await productApi.getProductById(id);
  //             const _product = productResp.data;
  //             console.log(_product);
  //             const reviewsResp = await productApi.getProductReview(_product._id);
  //             _product.reviews = reviewsResp.data;
  //             setProduct(_product);
  //         } catch (e) {
  //             toast.error(
  //                 e.response?.data?.error?.message ||
  //                     "L???y th??ng tin s???n ph???m th???t b???i! Vui l??ng th??? l???i sau."
  //             );
  //             console.error(e);
  //         } finally {
  //             setLoading(false);
  //         }
  //     };
  // >>>>>>> main

  const fetchSuggestProduct = async (_product) => {
    try {
      const resp = await productApi.getProductByCategory(
        _product.category?.slug,
      );
      setSuggestProducts(
        resp.data.filter((_item) => _item._id !== _product._id).slice(0, 5),
      );
    } catch (e) {
      toast.error(
        e.response?.data?.error?.message ||
          'L???y th??ng tin s???n ph???m th???t b???i! Vui l??ng th??? l???i sau.',
      );
      console.error(e);
    }
  };

  React.useEffect(() => {
    const idProduct = params.product.split('-').reverse()[0];
    fetchProduct(idProduct);
  }, [params]);

  React.useEffect(() => {
    if (product) {
      fetchSuggestProduct(product);
    }
  }, [product]);

  React.useEffect(() => {
    if (product) {
      document.title = `${product.name}`;
    }
  }, [product, user]);

  const switchCarousel = (idx) => {
    carouselRef.current.slickGoTo(idx);
  };

  const addProductToCart = () => {
    dispatch(cartActions.addProductToCart(product));
  };

  return (
    <>
      {product && (
        <>
          {/* // <<<<<<< fix/responsive-ui */}
          <div>
            <Link className="font-semibold" to="/">
              Trang ch???
            </Link>{' '}
            /{' '}
            <Link className="font-semibold" to={`/${product.category?.slug}`}>
              {product.category?.name}
            </Link>{' '}
            / <span className="font-semibold">{product.name}</span>
          </div>
          <div className="bg-white rounded-xl p-4 my-4">
            <div className="text-3xl font-semibold border-b pb-4">
              {product.name}
            </div>
            <div className="grid md:grid-cols-5 gap-8 pt-4">
              <div className="col-span-4">
                <div className="grid grid-cols-11 gap-8">
                  <div className="col-span-4 p-8">
                    <Slider
                      infinite
                      speed={500}
                      slidesToShow={1}
                      slidesToScroll={1}
                      autoplay
                      autoplaySpeed={5000}
                      ref={carouselRef}
                    >
                      {product.images.map((_img) => (
                        <div key={_img._id}>
                          <img
                            className="w-full"
                            src={getImageUrl(_img.fileName)}
                            alt={product.slug}
                          />
                        </div>
                      ))}
                    </Slider>
                    <div className="grid grid-cols-5 gap-2">
                      {product.images.map((_img, _idx) => (
                        <div
                          className="border border-gray-400 cursor-pointer hover:border-2"
                          key={_img._id}
                          onClick={() => switchCarousel(_idx)}
                        >
                          <img
                            className="w-full"
                            src={getImageUrl(_img.fileName)}
                            alt={product.slug}
                          />
                          {/* // =======
//             {product && (
//                 <>
//                     <div>
//                         <Link className="font-semibold" to="/">
//                             Trang ch???
//                         </Link>{" "}
//                         /{" "}
//                         <Link className="font-semibold" to={`/${product.category.slug}`}>
//                             {product.category.name}
//                         </Link>{" "}
//                         / <span className="font-semibold">{product.name}</span>
//                     </div>
//                     <div className="bg-white rounded-xl p-4 my-4">
//                         <div className="text-3xl font-semibold border-b pb-4">{product.name}</div>
//                         <div className="grid grid-cols-5 gap-8 pt-4">
//                             <div className="col-span-4">
//                                 <div className="grid grid-cols-11 gap-8">
//                                     <div className="col-span-4 p-8">
//                                         <Slider
//                                             infinite
//                                             speed={500}
//                                             slidesToShow={1}
//                                             slidesToScroll={1}
//                                             autoplay
//                                             autoplaySpeed={5000}
//                                             ref={carouselRef}
//                                         >
//                                             {product.images.map((_img) => (
//                                                 <div key={_img._id}>
//                                                     <img
//                                                         className="w-full"
//                                                         src={getImageUrl(_img.fileName)}
//                                                         alt={product.slug}
//                                                     />
//                                                 </div>
//                                             ))}
//                                         </Slider>
//                                         <div className="grid grid-cols-5 gap-2">
//                                             {product.images.map((_img, _idx) => (
//                                                 <div
//                                                     className="border border-gray-400 cursor-pointer hover:border-2"
//                                                     key={_img._id}
//                                                     onClick={() => switchCarousel(_idx)}
//                                                 >
//                                                     <img
//                                                         className="w-full"
//                                                         src={getImageUrl(_img.fileName)}
//                                                         alt={product.slug}
//                                                     />
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     </div>
//                                     <div className="col-span-7">
//                                         <div className="flex divide-x">
//                                             <div className="pr-4">
//                                                 ????nh gi??:{" "}
//                                                 {ratingIcons.map((_icon, _idx) => (
//                                                     <FontAwesomeIcon
//                                                         className="text-yellow-400"
//                                                         icon={_icon}
//                                                         key={_idx}
//                                                     />
//                                                 ))}{" "}
//                                                 {avgRating}
//                                             </div>
//                                             <div className="px-4">
//                                                 B??nh lu???n: {product.comments.length}
//                                             </div>
//                                             <div className="pl-4">L?????t xem: 0</div>
//                                         </div>
//                                         <div className="my-4">
//                                             <div>
//                                                 <label className="font-semibold">Gi???i thi???u</label>
//                                             </div>
//                                             <span>{product.description}</span>
//                                         </div>
//                                         <div>
//                                             <div>
//                                                 <label className="font-semibold">
//                                                     Th??ng s??? s???n ph???m
//                                                 </label>
//                                             </div>
//                                             <div className="h-72 overflow-auto">
//                                                 <table className="border w-full">
//                                                     <tbody>
//                                                         <tr className="odd:bg-gray-100">
//                                                             <td className="w-px whitespace-nowrap px-4 border-r">
//                                                                 H??ng s???n xu???t
//                                                             </td>
//                                                             <td className="px-4">
//                                                                 {product.manufacturer && product.manufacturer.name}
//                                                             </td>
//                                                         </tr>
//                                                         <tr className="odd:bg-gray-100">
//                                                             <td className="w-px whitespace-nowrap px-4 border-r">
//                                                                 Th???i gian b???o h??nh
//                                                             </td>
//                                                             <td className="px-4">
//                                                                 {product.warrantyDuration} th??ng
//                                                             </td>
//                                                         </tr>
//                                                         {product.properties.map(
//                                                             (_property, _idx) => (
//                                                                 <tr
//                                                                     className="odd:bg-gray-100"
//                                                                     key={_idx}
//                                                                 >
//                                                                     <td className="w-px whitespace-nowrap px-4 border-r">
//                                                                         {_property.key}
//                                                                     </td>
//                                                                     <td className="px-4">
//                                                                         {_property.value}
//                                                                     </td>
//                                                                 </tr>
//                                                             )
//                                                         )}
//                                                     </tbody>
//                                                 </table>
//                                             </div>
//                                         </div>
//                                         <div className="border border-gray-400 border-dotted py-8 px-4 rounded-lg">
//                                             <div>
//                                                 <span className="text-red-700 text-3xl font-bold">
//                                                     {formatVndCurrency(
//                                                         product.sale || product.price
//                                                     )}
//                                                 </span>
//                                                 {product.sale && (
//                                                     <>
//                                                         <span className="text-gray-800 line-through mx-2">
//                                                             {formatVndCurrency(product.price)}
//                                                         </span>
//                                                         <span>
//                                                             Ti???t ki???m{" "}
//                                                             {formatVndCurrency(
//                                                                 product.price - product.sale
//                                                             )}
//                                                         </span>
//                                                     </>
//                                                 )}
//                                             </div>
//                                             <div>
//                                                 <button className="bg-gray-200 font-semibold p-2 mt-8 mr-2">
//                                                     Gi?? ???? c?? VAT
//                                                 </button>
//                                                 <button className="bg-gray-200 font-semibold p-2 mt-8 ml-2">
//                                                     B???o h??nh {product.warrantyDuration} th??ng
//                                                 </button>
//                                             </div>
//                                         </div>
//                                         <button
//                                             className="bg-red-600 rounded-lg mt-4 w-full p-4 text-white"
//                                             onClick={addProductToCart}
//                                         >
//                                             <div className="font-bold text-xl">?????T MUA NGAY</div>
//                                             <div>Giao h??ng t???n n??i nhanh ch??ng</div>
//                                         </button>
//                                     </div>
//                                 </div>
//                             </div>
//                             <div>
//                                 <div className="border border-gray-200 rounded-xl mb-4 overflow-hidden">
//                                     <div className="border-b border-gray-200 p-3 font-semibold bg-gray-200">
//                                         Y??N T??M MUA H??NG
//                                     </div>
//                                     <div className="p-3">
//                                         <ul>
//                                             <li>- Uy t??n 20 n??m x??y d???ng v?? ph??t tri???n</li>
//                                             <li>- S???n ph???m ch??nh h??ng 100%</li>
//                                             <li>- Tr??? g??p l??i su???t 0% to??n b??? gi??? h??ng</li>
//                                             <li>- Tr??? b???o h??nh t???n n??i s??? d???ng</li>
//                                             <li>- B???o h??nh t???n n??i cho doanh nghi???p</li>
//                                             <li>- ??u ????i ri??ng cho h???c sinh sinh vi??n</li>
//                                             <li>- V??? sinh mi???n ph?? tr???n ?????i PC, Laptop</li>
//                                         </ul>
//                                     </div>
//                                 </div>
//                                 <div className="border border-gray-200 rounded-xl mt-4 overflow-hidden">
//                                     <div className="border-b border-gray-200 p-3 font-semibold bg-gray-200">
//                                         MI???N PH?? MUA H??NG
//                                     </div>
//                                     <div className="p-3">
//                                         <ul>
//                                             <li>- Giao h??ng si??u t???c trong 2h</li>
//                                             <li>- Giao h??ng mi???n ph?? to??n qu???c</li>
//                                             <li>- Nh???n h??ng v?? thanh to??n t???i nh?? (ship COD)</li>
//                                         </ul>
//                                     </div>
//                                 </div>
//                             </div>
// >>>>>>> main */}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="col-span-7">
                    <div className="flex divide-x">
                      <div className="pr-4">
                        ????nh gi??:{' '}
                        {ratingIcons.map((_icon, _idx) => (
                          <FontAwesomeIcon
                            className="text-yellow-400"
                            icon={_icon}
                            key={_idx}
                          />
                        ))}{' '}
                        {avgRating}
                      </div>
                      <div className="px-4">
                        B??nh lu???n: {product.comments.length}
                      </div>
                      <div className="pl-4">L?????t xem: 0</div>
                    </div>
                    <div className="my-4">
                      <div>
                        <label className="font-semibold">Gi???i thi???u</label>
                      </div>
                      <span className="text-gray-600">
                        {product.description}
                      </span>
                    </div>
                    <div>
                      <div>
                        <label className="font-semibold">
                          Th??ng s??? s???n ph???m
                        </label>
                      </div>
                      <div className="h-72 overflow-auto">
                        <table className="border w-full">
                          <tbody>
                            <tr className="odd:bg-gray-100">
                              <td className="w-px whitespace-nowrap px-4 border-r">
                                H??ng s???n xu???t
                              </td>
                              <td className="px-4">
                                {product.manufacturer?.name}
                              </td>
                            </tr>
                            <tr className="odd:bg-gray-100">
                              <td className="w-px whitespace-nowrap px-4 border-r">
                                Th???i gian b???o h??nh
                              </td>
                              <td className="px-4">
                                {product.warrantyDuration} th??ng
                              </td>
                            </tr>
                            {product.properties.map((_property, _idx) => (
                              <tr className="odd:bg-gray-100" key={_idx}>
                                <td className="w-px whitespace-nowrap px-4 border-r">
                                  {_property.key}
                                </td>
                                <td className="px-4">{_property.value}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="border border-gray-400 border-dotted py-8 px-4 rounded-lg">
                      <div>
                        <span className="text-red-700 text-3xl font-bold">
                          {formatVndCurrency(product.sale || product.price)}
                        </span>
                        {product.sale && (
                          <>
                            <span className="text-gray-800 line-through mx-2">
                              {formatVndCurrency(product.price)}
                            </span>
                            <span>
                              Ti???t ki???m{' '}
                              {formatVndCurrency(product.price - product.sale)}
                            </span>
                          </>
                        )}
                      </div>
                      <div>
                        <button className="bg-gray-200 font-semibold p-2 mt-8 mr-2">
                          Gi?? ???? c?? VAT
                        </button>
                        <button className="bg-gray-200 font-semibold p-2 mt-8 ml-2">
                          B???o h??nh {product.warrantyDuration} th??ng
                        </button>
                      </div>
                    </div>
                    <button
                      className="bg-red-600 rounded-lg mt-4 w-full p-4 text-white"
                      onClick={addProductToCart}
                    >
                      <div className="font-bold text-xl">?????T MUA NGAY</div>
                      <div>Giao h??ng t???n n??i nhanh ch??ng</div>
                    </button>
                  </div>
                </div>
              </div>
              <div>
                <div className="border border-gray-200 rounded-xl mb-4 overflow-hidden">
                  <div className="border-b border-gray-200 p-3 font-semibold bg-gray-200">
                    Y??N T??M MUA H??NG
                  </div>
                  <div className="p-3">
                    <ul>
                      <li>- Uy t??n 20 n??m x??y d???ng v?? ph??t tri???n</li>
                      <li>- S???n ph???m ch??nh h??ng 100%</li>
                      <li>- Tr??? g??p l??i su???t 0% to??n b??? gi??? h??ng</li>
                      <li>- Tr??? b???o h??nh t???n n??i s??? d???ng</li>
                      <li>- B???o h??nh t???n n??i cho doanh nghi???p</li>
                      <li>- ??u ????i ri??ng cho h???c sinh sinh vi??n</li>
                      <li>- V??? sinh mi???n ph?? tr???n ?????i PC, Laptop</li>
                    </ul>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-xl mt-4 overflow-hidden">
                  <div className="border-b border-gray-200 p-3 font-semibold bg-gray-200">
                    MI???N PH?? MUA H??NG
                  </div>
                  <div className="p-3">
                    <ul>
                      <li>- Giao h??ng si??u t???c trong 2h</li>
                      <li>- Giao h??ng mi???n ph?? to??n qu???c</li>
                      <li>- Nh???n h??ng v?? thanh to??n t???i nh?? (ship COD)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {suggestProducts.length > 0 && (
            <div className="bg-white rounded-xl px-4 py-2">
              <div className="text-xl font-semibold">B???n c?? th??? th??ch</div>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {suggestProducts.map((_product) => (
                  <ProductItem product={_product} key={_product._id} />
                ))}
              </div>
            </div>
          )}
          <div className="bg-white rounded-xl px-4 py-2 col-span-4">
            <div className="flex">
              <div
                className={classNames(
                  'text-xl font-semibold mr-8 cursor-pointer hover:bg-gray-200 rounded-md p-2',
                  activeSection === SECTION.REVIEW && 'bg-gray-200',
                )}
                onClick={() => setActiveSection(SECTION.REVIEW)}
              >
                ????nh gi?? s???n ph???m
              </div>
              <div
                className={classNames(
                  'text-xl font-semibold mr-8 cursor-pointer hover:bg-gray-200 rounded-md p-2',
                  activeSection === SECTION.COMMENT && 'bg-gray-200',
                )}
                onClick={() => setActiveSection(SECTION.COMMENT)}
              >
                B??nh lu???n
              </div>
            </div>
            {activeSection === SECTION.REVIEW && (
              <ReviewSection product={product} />
            )}
            {activeSection === SECTION.COMMENT && (
              <CommentSection product={product} />
            )}
          </div>
        </>
      )}
    </>
  );
}

export default ProductDetail;
