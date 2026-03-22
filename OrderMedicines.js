import React, { useState } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const style = document.createElement('style');
style.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=DM+Sans:wght@400;500&display=swap');

  .om-root {
    min-height: 100vh;
    background: #f0f4f8;
    font-family: 'DM Sans', sans-serif;
  }

  .om-topbar {
    background: white;
    padding: 0 28px;
    height: 64px;
    display: flex; align-items: center; justify-content: space-between;
    box-shadow: 0 2px 16px rgba(0,0,0,0.06);
    position: sticky; top: 0; z-index: 100;
  }

  .om-topbar-left { display: flex; align-items: center; gap: 12px; }

  .om-back {
    width: 38px; height: 38px;
    border-radius: 10px; border: 1px solid #eee;
    background: white; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; transition: all 0.2s;
  }
  .om-back:hover { background: #fff5f5; border-color: #ffcdd2; }

  .om-title {
    font-family: 'Outfit', sans-serif;
    font-size: 18px; font-weight: 700; color: #1a1a2e;
  }

  .om-cart-badge {
    background: #e53935; color: white;
    font-size: 12px; font-weight: 700;
    padding: 4px 12px; border-radius: 20px;
    display: flex; align-items: center; gap: 6px;
  }

  .om-body {
    display: grid;
    grid-template-columns: 1fr 340px;
    gap: 24px;
    max-width: 1100px;
    margin: 0 auto;
    padding: 28px 24px;
  }

  /* SEARCH */
  .om-search-wrap {
    display: flex; align-items: center; gap: 10px;
    background: white; border-radius: 14px;
    padding: 12px 16px; border: 1.5px solid #eee;
    margin-bottom: 20px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.04);
    transition: border-color 0.2s;
  }
  .om-search-wrap:focus-within { border-color: #e53935; }

  .om-search-input {
    border: none; background: none; outline: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px; color: #1a1a2e; flex: 1;
  }

  /* SECTION TITLE */
  .om-section-title {
    font-family: 'Outfit', sans-serif;
    font-size: 16px; font-weight: 700; color: #1a1a2e;
    margin-bottom: 14px;
  }

  /* MEDICINE GRID */
  .om-med-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;
    margin-bottom: 28px;
  }

  .om-med-card {
    background: white;
    border-radius: 16px;
    padding: 18px;
    border: 1.5px solid #eee;
    transition: all 0.25s cubic-bezier(0.22,1,0.36,1);
    box-shadow: 0 2px 12px rgba(0,0,0,0.04);
    position: relative;
    overflow: hidden;
    animation: fadeUp 0.5s both;
  }

  .om-med-card:hover {
    transform: translateY(-4px);
    border-color: #ffcdd2;
    box-shadow: 0 10px 30px rgba(229,57,53,0.1);
  }

  .om-med-card.in-cart {
    border-color: #e53935;
    background: #fff5f5;
  }

  .om-med-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0;
    height: 3px;
    border-radius: 16px 16px 0 0;
  }

  .om-med-icon {
    width: 48px; height: 48px; border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    font-size: 22px; margin-bottom: 12px;
  }

  .om-med-name {
    font-family: 'Outfit', sans-serif;
    font-size: 13.5px; font-weight: 700; color: #1a1a2e;
    margin-bottom: 4px; line-height: 1.3;
  }

  .om-med-category { font-size: 11px; color: #888; margin-bottom: 10px; }

  .om-med-price {
    font-family: 'Outfit', sans-serif;
    font-size: 18px; font-weight: 800; color: #e53935;
    margin-bottom: 12px;
  }

  .om-add-btn {
    width: 100%; padding: 9px;
    border: none; border-radius: 10px;
    font-family: 'Outfit', sans-serif;
    font-size: 13px; font-weight: 700;
    cursor: pointer; transition: all 0.2s;
  }

  .om-add-btn.add {
    background: linear-gradient(135deg, #e53935, #c62828);
    color: white;
    box-shadow: 0 3px 12px rgba(229,57,53,0.3);
  }

  .om-add-btn.add:hover { transform: translateY(-1px); box-shadow: 0 5px 18px rgba(229,57,53,0.4); }

  .om-add-btn.added {
    background: #e8f5e9; color: #2e7d32;
    border: 1.5px solid #a5d6a7;
  }

  .om-qty-ctrl {
    display: flex; align-items: center; justify-content: center; gap: 10px;
  }

  .om-qty-btn {
    width: 28px; height: 28px; border-radius: 8px;
    border: 1.5px solid #ffcdd2; background: white;
    color: #e53935; font-size: 16px; font-weight: 700;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    transition: all 0.2s;
  }
  .om-qty-btn:hover { background: #e53935; color: white; }

  .om-qty-num {
    font-family: 'Outfit', sans-serif;
    font-size: 15px; font-weight: 800; color: #1a1a2e; min-width: 20px; text-align: center;
  }

  /* CART */
  .om-cart {
    background: white; border-radius: 20px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.06);
    border: 1px solid rgba(0,0,0,0.04);
    position: sticky; top: 88px;
    overflow: hidden;
  }

  .om-cart-header {
    padding: 18px 20px 14px;
    border-bottom: 1px solid #f5f5f5;
    display: flex; align-items: center; justify-content: space-between;
  }

  .om-cart-title {
    font-family: 'Outfit', sans-serif;
    font-size: 15px; font-weight: 700; color: #1a1a2e;
  }

  .om-cart-count {
    background: #fff5f5; color: #e53935;
    font-size: 12px; font-weight: 700;
    padding: 3px 10px; border-radius: 20px;
    border: 1px solid #ffcdd2;
  }

  .om-cart-items { padding: 8px 0; max-height: 320px; overflow-y: auto; }
  .om-cart-items::-webkit-scrollbar { width: 3px; }
  .om-cart-items::-webkit-scrollbar-thumb { background: #eee; border-radius: 3px; }

  .om-cart-item {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 16px;
    border-bottom: 1px solid #fafafa;
  }
  .om-cart-item:last-child { border-bottom: none; }

  .om-cart-item-icon {
    width: 34px; height: 34px; border-radius: 10px;
    background: #fff5f5;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px; flex-shrink: 0;
  }

  .om-cart-item-name { font-size: 12.5px; font-weight: 600; color: #1a1a2e; }
  .om-cart-item-price { font-size: 12px; color: #e53935; font-weight: 700; }

  .om-cart-remove {
    margin-left: auto;
    width: 26px; height: 26px; border-radius: 8px;
    border: 1px solid #ffcdd2; background: #fff5f5;
    color: #e53935; cursor: pointer; font-size: 12px;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.2s; flex-shrink: 0;
  }
  .om-cart-remove:hover { background: #e53935; color: white; }

  .om-cart-empty {
    padding: 32px; text-align: center;
    font-size: 13px; color: #888;
  }

  .om-cart-footer { padding: 16px 20px; border-top: 1px solid #f5f5f5; }

  .om-total-row {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 14px;
  }

  .om-total-label { font-size: 13px; color: #888; }

  .om-total-val {
    font-family: 'Outfit', sans-serif;
    font-size: 22px; font-weight: 800; color: #1a1a2e;
  }

  .om-order-btn {
    width: 100%; padding: 14px;
    background: linear-gradient(135deg, #e53935, #c62828);
    color: white; border: none; border-radius: 12px;
    font-family: 'Outfit', sans-serif;
    font-size: 15px; font-weight: 700;
    cursor: pointer; transition: all 0.2s;
    box-shadow: 0 6px 20px rgba(229,57,53,0.35);
  }

  .om-order-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(229,57,53,0.45); }
  .om-order-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .om-med-card:nth-child(1) { animation-delay: 0.05s; }
  .om-med-card:nth-child(2) { animation-delay: 0.1s; }
  .om-med-card:nth-child(3) { animation-delay: 0.15s; }
  .om-med-card:nth-child(4) { animation-delay: 0.2s; }
  .om-med-card:nth-child(5) { animation-delay: 0.25s; }
  .om-med-card:nth-child(6) { animation-delay: 0.3s; }

  @media (max-width: 768px) {
    .om-body { grid-template-columns: 1fr; }
    .om-med-grid { grid-template-columns: repeat(2,1fr); }
    .om-cart { position: static; }
  }
`;
document.head.appendChild(style);

const medicineList =  [
  { id: 1, name: 'Paracetamol 500mg', price: 20, icon: '💊', category: 'Pain Relief', color: '#fff5f5', bar: '#e53935',
    image: 'https://www.netmeds.com/images/product-v1/600x600/1043873/paracetamol_500mg_tablet_15s_0.jpg' },
  { id: 2, name: 'Vitamin D3 60K', price: 150, icon: '🌞', category: 'Vitamins', color: '#fffde7', bar: '#f9a825',
    image: 'https://onemg.gumlet.io/l_watermark_346,w_480,h_480/a_ignore,w_480,h_480,c_fit,q_auto,f_auto/4f7b0e95d4764e51b67295b94f2b2afa.jpg' },
  { id: 3, name: 'Amlodipine 5mg', price: 80, icon: '🫀', category: 'Cardiac', color: '#fce4ec', bar: '#e91e63',
    image: 'https://onemg.gumlet.io/l_watermark_346,w_480,h_480/a_ignore,w_480,h_480,c_fit,q_auto,f_auto/epblmxgrlkm4pkaqczbo.jpg' },
  { id: 4, name: 'Metformin 500mg', price: 60, icon: '🧪', category: 'Diabetes', color: '#e3f2fd', bar: '#1976d2',
    image: 'https://onemg.gumlet.io/l_watermark_346,w_480,h_480/a_ignore,w_480,h_480,c_fit,q_auto,f_auto/vxkpkrpjqfcbtjfbzxth.jpg' },
  { id: 5, name: 'Pantoprazole 40mg', price: 90, icon: '🫁', category: 'Gastric', color: '#e8f5e9', bar: '#2e7d32',
    image: 'https://onemg.gumlet.io/l_watermark_346,w_480,h_480/a_ignore,w_480,h_480,c_fit,q_auto,f_auto/rnxnvxbqjpqqgjyasfbx.jpg' },
  { id: 6, name: 'Cetirizine 10mg', price: 30, icon: '🌿', category: 'Allergy', color: '#f3e5f5', bar: '#7b1fa2',
    image: 'https://onemg.gumlet.io/l_watermark_346,w_480,h_480/a_ignore,w_480,h_480,c_fit,q_auto,f_auto/xvjvkkhjpkfzxjjprdqq.jpg' },
];

function OrderMedicines() {
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getCartItem = (id) => cart.find(item => item.id === id);

  const addToCart = (medicine) => {
    const exists = cart.find(item => item.id === medicine.id);
    if (exists) {
      setCart(cart.map(item => item.id === medicine.id ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setCart([...cart, { ...medicine, qty: 1 }]);
    }
  };

  const decreaseQty = (id) => {
    const item = cart.find(i => i.id === id);
    if (item.qty === 1) {
      setCart(cart.filter(i => i.id !== id));
    } else {
      setCart(cart.map(i => i.id === id ? { ...i, qty: i.qty - 1 } : i));
    }
  };

  const removeFromCart = (id) => setCart(cart.filter(item => item.id !== id));

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  const filtered = medicineList.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.category.toLowerCase().includes(search.toLowerCase())
  );

  const placeOrder = async () => {
    if (cart.length === 0) return alert('Cart is empty!');
    setLoading(true);
    try {
      await addDoc(collection(db, 'orders'), {
        uid: auth.currentUser.uid,
        items: cart, total: totalPrice,
        status: 'Pending', createdAt: new Date()
      });
      alert('Order placed successfully! 🎉');
      setCart([]);
      navigate('/dashboard');
    } catch (err) { alert('Error: ' + err.message); }
    setLoading(false);
  };

  return (
    <div className="om-root">

      {/* TOPBAR */}
      <div className="om-topbar">
        <div className="om-topbar-left">
          <button className="om-back" onClick={() => navigate('/dashboard')}>←</button>
          <span className="om-title">💊 Order Medicines</span>
        </div>
        {cart.length > 0 && (
          <span className="om-cart-badge">🛒 {totalItems} items · ₹{totalPrice}</span>
        )}
      </div>

      <div className="om-body">

        {/* LEFT — Medicine List */}
        <div>
          {/* Search */}
          <div className="om-search-wrap">
            <span>🔍</span>
            <input
              className="om-search-input"
              placeholder="Search medicines or category..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="om-section-title">💊 Available Medicines</div>
          <div className="om-med-grid">
            {filtered.map(med => {
              const cartItem = getCartItem(med.id);
              return (
                <div
                  key={med.id}
                  className={`om-med-card ${cartItem ? 'in-cart' : ''}`}
                  style={{'--bar-color': med.bar}}
                >
                  <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0,
                    height: '3px', background: med.bar,
                    borderRadius: '16px 16px 0 0'
                  }} />
                  <div className="om-med-icon" style={{background: med.color, padding:0, overflow:'hidden'}}>
  <img
    src={med.image}
    alt={med.name}
    style={{width:'100%', height:'100%', objectfit:'cover', borderradius:14}}
    onerror={e => { e.target.style.display='none'; e.target.parentelement.innerhtml = med.icon; }}
  />
</div>
                  <div className="om-med-name">{med.name}</div>
                  <div className="om-med-category">{med.category}</div>
                  <div className="om-med-price">₹{med.price}</div>

                  {cartItem ? (
                    <div className="om-qty-ctrl">
                      <button className="om-qty-btn" onClick={() => decreaseQty(med.id)}>−</button>
                      <span className="om-qty-num">{cartItem.qty}</span>
                      <button className="om-qty-btn" onClick={() => addToCart(med)}>+</button>
                    </div>
                  ) : (
                    <button className="om-add-btn add" onClick={() => addToCart(med)}>
                      + Add to Cart
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT — Cart */}
        <div>
          <div className="om-cart">
            <div className="om-cart-header">
              <span className="om-cart-title">🛒 Your Cart</span>
              <span className="om-cart-count">{cart.length} items</span>
            </div>

            <div className="om-cart-items">
              {cart.length === 0 ? (
                <div className="om-cart-empty">
                  <div style={{fontSize:36, marginBottom:8}}>🛒</div>
                  <div>Cart is empty</div>
                  <div style={{fontSize:12, marginTop:4, color:'#bbb'}}>Add medicines to get started</div>
                </div>
              ) : (
                cart.map(item => (
                  <div className="om-cart-item" key={item.id}>
                    <div className="om-cart-item-icon">{item.icon}</div>
                    <div style={{flex:1, minWidth:0}}>
                      <div className="om-cart-item-name">{item.name}</div>
                      <div className="om-cart-item-price">₹{item.price} × {item.qty} = ₹{item.price * item.qty}</div>
                    </div>
                    <button className="om-cart-remove" onClick={() => removeFromCart(item.id)}>✕</button>
                  </div>
                ))
              )}
            </div>

            <div className="om-cart-footer">
              <div className="om-total-row">
                <span className="om-total-label">Total Amount</span>
                <span className="om-total-val">₹{totalPrice}</span>
              </div>
              <button
                className="om-order-btn"
                onClick={placeOrder}
                disabled={loading || cart.length === 0}
              >
                {loading ? '⏳ Placing Order...' : '🛒 Place Order'}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default OrderMedicines;