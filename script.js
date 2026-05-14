// --- Dữ liệu Hệ thống ---
const vColors = { "Ánh vàng": "c-anh-vang", "Cầu vồng": "c-cau-vong", "Ẩm ướt": "c-am-uot", "Nhiễm điện": "c-nhiem-dien", "Gió": "c-gio", "Khí lạnh": "c-khi-lanh", "Cát": "c-cat", "Ánh trăng": "c-anh-trang", "Băng": "c-bang", "Cực quang": "c-cuc-quang", "Sương": "c-suong", "Khô": "c-kho", "Nguyền rủa": "c-nguyen-rua", "Đèn trời": "c-den-troi", "Ảo ảnh": "c-ao-anh", "Pháo hoa": "c-phao-hoa", "Bướm": "c-buom", "Giai điệu": "c-giai-dieu" };
const products = [ {name:"Nhân sâm", p:725000, i:" 🥕 "}, {name:"Bánh bao", p:180000, i:" 🥟 "}, {name:"Cây Đậu", p:12000, i:" 🫘 "}, {name:"Khế", p:10000, i:" ⭐ "}, {name:"Đào giòn", p:8500, i:" 🍑 "}, {name:"Táo đường", p:7600, i:" 🍎 "}, {name:"Dưa hấu", p:5800, i:" 🍉 "}, {name:"Bí ngô", p:5167, i:" 🎃 "}, {name:"Người tuyết", p:4600, i:" ⛄ "}, {name:"Xoài", p:3000, i:" 🥭 "}, {name:"Sầu riêng", p:2500, i:" 🍈 "}, {name:"Xương rồng", p:2300, i:" 🌵 "}, {name:"Táo", p:2200, i:" 🍎 "}, {name:"Nho", p:1050, i:" 🍇 "}, {name:"Dừa", p:1000, i:" 🥥 "}, {name:"Cây tùng", p:300, i:" 🌲 "} ];
const variants = [ {n:"Ánh vàng", v:3, t:"r"}, {n:"Cầu vồng", v:2, t:"r"}, {n:"Ẩm ướt", v:0.1, t:"e"}, {n:"Nhiễm điện", v:0.2, t:"e"}, {n:"Gió", v:0.2, t:"e"}, {n:"Khí lạnh", v:0.4, t:"e"}, {n:"Cát", v:0.2, t:"e"}, {n:"Ánh trăng", v:0.4, t:"e"}, {n:"Băng", v:0.3, t:"e"}, {n:"Cực quang", v:0.4, t:"e"}, {n:"Sương", v:0.4, t:"e"}, {n:"Khô", v:0.2, t:"e"}, {n:"Nguyền rủa", v:0.2, t:"e"}, {n:"Đèn trời", v:0.4, t:"e"}, {n:"Ảo ảnh", v:0.3, t:"e"}, {n:"Pháo hoa", v:0.2, t:"e"}, {n:"Bướm", v:0.3, t:"e"}, {n:"Giai điệu", v:0.3, t:"e"} ];

let accounts = JSON.parse(localStorage.getItem('tuna_farm_accounts')) || ["Acc_Chính"];
let inventory = JSON.parse(localStorage.getItem('tuna_farm_data')) || products.map(p => ({...p, items: []}));
let calcHist = []; let curF = null;

// --- Hàm Hệ thống & Sao lưu ---
function saveData() {
    localStorage.setItem('tuna_farm_accounts', JSON.stringify(accounts));
    localStorage.setItem('tuna_farm_data', JSON.stringify(inventory));
}

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
        const data = JSON.parse(event.target.result);
        if (data.accounts && data.inventory) {
            if (confirm("Ghi đè dữ liệu cũ?")) {
                localStorage.setItem('tuna_farm_accounts', JSON.stringify(data.accounts));
                localStorage.setItem('tuna_farm_data', JSON.stringify(data.inventory));
                location.reload();
            }
        }
    };
    reader.readAsText(file);
}

// --- Quản lý Giao diện ---
function renderInv() {
    const grid = document.getElementById('inv-grid'); grid.innerHTML = ''; let total = 0;
    inventory.forEach(f => {
        let q = 0; f.items.forEach(it => {
            q += it.q; let rm = 1, eb = 0;
            it.vars.forEach(v => { let d = variants.find(x => x.n === v); if(d) d.t === 'r' ? rm *= d.v : eb += d.v; });
            total += Math.floor(it.w * f.p * rm * (1 + eb)) * it.q;
        });
        grid.innerHTML += `<div class="item-card" onclick="openSub('${f.name}')"><span class="badge-qty">${q}</span><span style="font-size:30px;display:block">${f.i}</span><b>${f.name}</b></div>`;
    });
    document.getElementById('inv-total').innerText = total.toLocaleString() + ' xu';
    saveData();
}

function openAccModal() { document.getElementById('modal-acc').style.display = 'flex'; renderAccList(); }
function closeAccModal() { document.getElementById('modal-acc').style.display = 'none'; }

// ... (Copy các hàm addAccount, deleteAccount, openCalcModal, execCalc từ file cũ của bạn vào đây)
// Nhớ xóa các đoạn ghi chú console.log thừa để code chạy nhanh hơn.

window.onload = renderInv;