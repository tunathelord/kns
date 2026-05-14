// 1. DỮ LIỆU GỐC
const vColors = { "Ánh vàng": "c-anh-vang", "Cầu vồng": "c-cau-vong", "Ẩm ướt": "c-am-uot", "Nhiễm điện": "c-nhiem-dien", "Gió": "c-gio", "Khí lạnh": "c-khi-lanh", "Cát": "c-cat", "Ánh trăng": "c-anh-trang", "Băng": "c-bang", "Cực quang": "c-cuc-quang", "Sương": "c-suong", "Khô": "c-kho", "Nguyền rủa": "c-nguyen-rua", "Đèn trời": "c-den-troi", "Ảo ảnh": "c-ao-anh", "Pháo hoa": "c-phao-hoa", "Bướm": "c-buom", "Giai điệu": "c-giai-dieu" };
const products = [ {name:"Nhân sâm", p:725000, i:" 🥕 "}, {name:"Bánh bao", p:180000, i:" 🥟 "}, {name:"Cây Đậu", p:12000, i:" 🫘 "}, {name:"Khế", p:10000, i:" ⭐ "}, {name:"Đào giòn", p:8500, i:" 🍑 "}, {name:"Táo đường", p:7600, i:" 🍎 "}, {name:"Dưa hấu", p:5800, i:" 🍉 "}, {name:"Bí ngô", p:5167, i:" 🎃 "}, {name:"Người tuyết", p:4600, i:" ⛄ "}, {name:"Xoài", p:3000, i:" 🥭 "}, {name:"Sầu riêng", p:2500, i:" 🍈 "}, {name:"Xương rồng", p:2300, i:" 🌵 "}, {name:"Táo", p:2200, i:" 🍎 "}, {name:"Nho", p:1050, i:" 🍇 "}, {name:"Dừa", p:1000, i:" 🥥 "}, {name:"Cây tùng", p:300, i:" 🌲 "} ];
const variants = [ {n:"Ánh vàng", v:3, t:"r"}, {n:"Cầu vồng", v:2, t:"r"}, {n:"Ẩm ướt", v:0.1, t:"e"}, {n:"Nhiễm điện", v:0.2, t:"e"}, {n:"Gió", v:0.2, t:"e"}, {n:"Khí lạnh", v:0.4, t:"e"}, {n:"Cát", v:0.2, t:"e"}, {n:"Ánh trăng", v:0.4, t:"e"}, {n:"Băng", v:0.3, t:"e"}, {n:"Cực quang", v:0.4, t:"e"}, {n:"Sương", v:0.4, t:"e"}, {n:"Khô", v:0.2, t:"e"}, {n:"Nguyền rủa", v:0.2, t:"e"}, {n:"Đèn trời", v:0.4, t:"e"}, {n:"Ảo ảnh", v:0.3, t:"e"}, {n:"Pháo hoa", v:0.2, t:"e"}, {n:"Bướm", v:0.3, t:"e"}, {n:"Giai điệu", v:0.3, t:"e"} ];

// 2. KHỞI TẠO BIẾN
let accounts = JSON.parse(localStorage.getItem('tuna_farm_accounts')) || ["Acc_Chính"];
let inventory = JSON.parse(localStorage.getItem('tuna_farm_data')) || products.map(p => ({...p, items: []}));
let curSub = null;

// 3. HÀM LƯU DỮ LIỆU
function saveData() {
    localStorage.setItem('tuna_farm_accounts', JSON.stringify(accounts));
    localStorage.setItem('tuna_farm_data', JSON.stringify(inventory));
}

// 4. HIỂN THỊ CHÍNH (renderInv)
function renderInv() {
    const grid = document.getElementById('inv-grid');
    if(!grid) return;
    grid.innerHTML = '';
    let total = 0;

    inventory.forEach(f => {
        let q = 0;
        f.items.forEach(it => {
            q += it.q;
            let rm = 1, eb = 0;
            it.vars.forEach(v => {
                let d = variants.find(x => x.n === v);
                if(d) d.t === 'r' ? rm *= d.v : eb += d.v;
            });
            total += Math.floor(it.w * f.p * rm * (1 + eb)) * it.q;
        });
        grid.innerHTML += `
            <div class="item-card" onclick="openSub('${f.name}')">
                <span class="badge-qty">${q}</span>
                <span style="font-size:30px;display:block">${f.i}</span>
                <b>${f.name}</b>
            </div>`;
    });
    document.getElementById('inv-total').innerText = total.toLocaleString() + ' xu';
    saveData();
}

// 5. CÁC HÀM MỞ/ĐÓNG MODAL (SỬA LỖI DEFINED)
function openAccModal() { document.getElementById('modal-acc').style.display = 'flex'; renderAccList(); }
function closeAccModal() { document.getElementById('modal-acc').style.display = 'none'; }

function openCalcModal() { document.getElementById('modal-calc').style.display = 'flex'; }
function closeCalcModal() { document.getElementById('modal-calc').style.display = 'none'; }

function openFilterModal() { document.getElementById('modal-filter').style.display = 'flex'; renderFilterOptions(); }
function closeFilterModal() { document.getElementById('modal-filter').style.display = 'none'; }

function openSub(name) {
    curSub = name;
    const f = inventory.find(x => x.name === name);
    document.getElementById('sub-title').innerText = f.i + " " + f.name;
    document.getElementById('main-view').classList.remove('active-view');
    document.getElementById('sub-view').classList.add('active-view');
    renderSubList();
}
function closeSubView() {
    document.getElementById('sub-view').classList.remove('active-view');
    document.getElementById('main-view').classList.add('active-view');
}

// 6. QUẢN LÝ TÀI KHOẢN
function renderAccList() {
    const container = document.getElementById('acc-list-container');
    if(!container) return;
    container.innerHTML = accounts.map(acc => `
        <div style="display:flex; justify-content:space-between; padding:10px; background:white; margin-bottom:5px; border-radius:10px; align-items:center;">
            <span>${acc}</span>
            <button onclick="deleteAccount('${acc}')" style="color:red; border:none; background:none; font-weight:bold;">Xóa</button>
        </div>
    `).join('');
}

function addAccount() {
    const input = document.getElementById('new-acc-name');
    const name = input.value.trim();
    if(name && !accounts.includes(name)) {
        accounts.push(name);
        input.value = '';
        renderAccList();
        saveData();
    }
}

function deleteAccount(name) {
    if(confirm(`Xóa tài khoản ${name}?`)) {
        accounts = accounts.filter(a => a !== name);
        renderAccList();
        saveData();
    }
}

// 7. SAO LƯU/KHÔI PHỤC
function exportData() {
    const data = { accounts, inventory, date: new Date().toLocaleString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `BackUp_PTG_${new Date().toLocaleDateString()}.json`;
    a.click();
}

function importData(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const data = JSON.parse(event.target.result);
            if (data.accounts && data.inventory) {
                if (confirm("Ghi đè dữ liệu cũ?")) {
                    localStorage.setItem('tuna_farm_accounts', JSON.stringify(data.accounts));
                    localStorage.setItem('tuna_farm_data', JSON.stringify(data.inventory));
                    location.reload();
                }
            }
        } catch(err) { alert("File không hợp lệ!"); }
    };
    reader.readAsText(file);
}

// 8. HÀM PHỤ TRỢ (FILTER/HELP)
function renderFilterOptions() {
    const fAcc = document.getElementById('f-acc');
    const fProd = document.getElementById('f-prod');
    if(fAcc) fAcc.innerHTML = '<option value="all">-- Tất cả tài khoản --</option>' + accounts.map(a => `<option value="${a}">${a}</option>`).join('');
    if(fProd) fProd.innerHTML = '<option value="all">-- Tất cả nông sản --</option>' + products.map(p => `<option value="${p.name}">${p.name}</option>`).join('');
}

function showHelp(key) {
    const helpData = {
        'acc': "Quản lý danh sách các tài khoản game của bạn. Bạn có thể thêm, xóa hoặc Sao lưu dữ liệu tại đây.",
        'calc': "Máy tính giúp bạn tính nhanh giá trị nông sản dựa trên cân nặng và các biến thể.",
        'filter': "Tìm kiếm nông sản nhanh theo tài khoản hoặc loại biến thể cụ thể."
    };
    alert(helpData[key] || "Chưa có hướng dẫn.");
}

// KHỞI TẠO
window.onload = function() {
    renderInv();
};
