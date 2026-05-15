const vColors = { "Ánh vàng": "c-anh-vang", "Cầu vồng": "c-cau-vong", "Ẩm ướt": "c-am-uot", "Nhiễm điện": "c-nhiem-dien", "Gió": "c-gio", "Khí lạnh": "c-khi-lanh", "Cát": "c-cat", "Ánh trăng": "c-anh-trang", "Băng": "c-bang", "Cực quang": "c-cuc-quang", "Sương": "c-suong", "Khô": "c-kho", "Nguyền rủa": "c-nguyen-rua", "Đèn trời": "c-den-troi", "Ảo ảnh": "c-ao-anh", "Pháo hoa": "c-phao-hoa", "Bướm": "c-buom", "Giai điệu": "c-giai-dieu" };
const products = [
    { name: "Nhân sâm", p: 725000 },
    { name: "Bánh bao", p: 180000 },
    { name: "Cây Đậu", p: 12000 },
    { name: "Nấm", p: 12000 },
    { name: "Khế", p: 10000 },
    { name: "Đào giòn", p: 8500 },
    { name: "Táo đường", p: 7600 },
    { name: "Dưa hấu", p: 5800 },
    { name: "Bí ngô", p: 5167 },
    { name: "Người tuyết", p: 4600 },
    { name: "Rau chân vịt", p: 3340 },
    { name: "Xoài", p: 3000 },
    { name: "Bắp", p: 2650 },
    { name: "Sầu riêng", p: 2500 },
    { name: "Xương rồng", p: 2300 },
    { name: "Chanh", p: 2200 },
    { name: "Táo", p: 2200 },
    { name: "Đu đủ", p: 1900 },
    { name: "Trái sung", p: 1500 },
    { name: "Nho", p: 1050 },
    { name: "Dừa", p: 1000 },
    { name: "Cà chua", p: 580 },
    { name: "Mãng cầu", p: 400 },
    { name: "Rau xà lách", p: 341 },
    { name: "Cây tùng", p: 300 },
    { name: "Cà rốt", p: 85 },
    { name: "Việt quất", p: 25 },
    { name: "Dâu tây", p: 10 }
];
const variants = [ {n:"Ánh vàng", v:3, t:"r"}, {n:"Cầu vồng", v:2, t:"r"}, {n:"Ẩm ướt", v:0.1, t:"e"}, {n:"Nhiễm điện", v:0.2, t:"e"}, {n:"Gió", v:0.2, t:"e"}, {n:"Khí lạnh", v:0.4, t:"e"}, {n:"Cát", v:0.2, t:"e"}, {n:"Ánh trăng", v:0.4, t:"e"}, {n:"Băng", v:0.3, t:"e"}, {n:"Cực quang", v:0.4, t:"e"}, {n:"Sương", v:0.4, t:"e"}, {n:"Khô", v:0.2, t:"e"}, {n:"Nguyền rủa", v:0.2, t:"e"}, {n:"Đèn trời", v:0.4, t:"e"}, {n:"Ảo ảnh", v:0.3, t:"e"}, {n:"Pháo hoa", v:0.2, t:"e"}, {n:"Bướm", v:0.3, t:"e"}, {n:"Giai điệu", v:0.3, t:"e"} ];
    
    let accounts = JSON.parse(localStorage.getItem('tuna_farm_accounts')) || ["Acc_Chính"];
    let inventory = JSON.parse(localStorage.getItem('tuna_farm_data')) || products.map(p => ({...p, items: []}));
    let curF = null; let calcHist = [];

    function saveData() {
        localStorage.setItem('tuna_farm_accounts', JSON.stringify(accounts));
        localStorage.setItem('tuna_farm_data', JSON.stringify(inventory));
    }

    function renderInv() {
        const grid = document.getElementById('inv-grid'); grid.innerHTML = ''; let total = 0;
        inventory.forEach(f => {
            let q = 0; f.items.forEach(it => {
                q += it.q; let rm = 1, eb = 0;
                it.vars.forEach(v => { let d = variants.find(x => x.n === v); if(d) d.t === 'r' ? rm *= d.v : eb += d.v; });
                total += Math.floor(it.w * f.p * rm * (1 + eb)) * it.q;
            });
            grid.innerHTML += `<div class="item-card" onclick="openSub('${f.name}')"><span class="badge-qty">${q}</span><span class="item-icon">${f.i}</span><span class="item-name">${f.name}</span></div>`;
        });
        document.getElementById('inv-total').innerText = total.toLocaleString() + ' xu';
        saveData();
    }

    function openAccModal() {
        document.getElementById('modal-acc').style.display = 'flex';
        renderAccList();
    }
    function closeAccModal() { document.getElementById('modal-acc').style.display = 'none'; }

    function renderAccList() {
        const container = document.getElementById('acc-list-container');
        if(accounts.length === 0) { container.innerHTML = `<p style="text-align:center;color:gray;font-size:13px;">Chưa có tài khoản nào. Hãy tạo mới!</p>`; return; }
        container.innerHTML = accounts.map((acc, index) => `
            <div class="acc-item-row">
                <span class="acc-item-name">${acc}</span>
                <div class="acc-item-actions">
                    <button class="btn-acc-action" style="background:#FFA500; box-shadow:0 3px 0 #CC8400;" onclick="renameAccount('${acc}')">SỬA</button>
                    <button class="btn-acc-action" style="background:#FF6B6B; box-shadow:0 3px 0 #D15252;" onclick="deleteAccount('${acc}')">×</button>
                </div>
            </div>
        `).join('');
    }

    function addAccount() {
        const input = document.getElementById('new-acc-name');
        let name = input.value.trim();
        if(!name) { name = "Acc_" + (accounts.length + 1); }
        if(accounts.includes(name)) { alert("Tên tài khoản này đã tồn tại!"); return; }
        accounts.push(name); input.value = ''; renderAccList(); saveData();
    }

    function renameAccount(oldName) {
        const newName = prompt("Nhập tên mới cho tài khoản '" + oldName + "':", oldName);
        if(!newName || newName.trim() === '' || newName === oldName) return;
        if(accounts.includes(newName.trim())) { alert("Tên tài khoản mới đã tồn tại!"); return; }

        const idx = accounts.indexOf(oldName);
        accounts[idx] = newName.trim();
        inventory.forEach(prod => {
            prod.items.forEach(item => { if(item.acc === oldName) item.acc = newName.trim(); });
        });
        renderAccList(); renderInv();
    }

    function deleteAccount(accName) {
        if(confirm(`Bạn có chắc chắn muốn xóa tài khoản [${accName}]?\nHành động này sẽ XÓA TOÀN BỘ nông sản của tài khoản này trong kho!`)) {
            accounts = accounts.filter(a => a !== accName);
            inventory.forEach(prod => { prod.items = prod.items.filter(item => item.acc !== accName); });
            renderAccList(); renderInv(); if(curF) renderSubList();
        }
    }

    function openFilterModal() {
        document.getElementById('modal-filter').style.display = 'flex';
        let accSelect = `<option value="all">-- Tất cả tài khoản --</option>`;
        accounts.forEach(a => accSelect += `<option value="${a}"> 👥 ${a}</option>`);
        document.getElementById('f-acc').innerHTML = accSelect;
        
        let prodSelect = `<option value="all">-- Tất cả nông sản --</option>`;
        products.forEach(p => prodSelect += `<option value="${p.name}">${p.i} ${p.name}</option>`);
        document.getElementById('f-prod').innerHTML = prodSelect;

        let varSelect = `<option value="all">-- Tất cả biến thể --</option>`;
        variants.forEach(v => varSelect += `<option value="${v.n}">${v.n}</option>`);
        document.getElementById('f-var').innerHTML = varSelect;
    }

    function closeFilterModal() { document.getElementById('modal-filter').style.display = 'none'; }
    function closeFilterResultView() { document.getElementById('filter-result-view').classList.remove('active-view'); document.getElementById('main-view').classList.add('active-view'); renderInv(); }

    function execFilter() {
        const fAcc = document.getElementById('f-acc').value;
        const fType = document.querySelector('input[name="f-type"]:checked').value;
        const fProd = document.getElementById('f-prod').value;
        const fVar = document.getElementById('f-var').value;
        const fSort = document.querySelector('input[name="f-sort"]:checked').value;
        let results = [];
        
        inventory.forEach(prod => {
            if (fProd !== 'all' && prod.name !== fProd) return;
            prod.items.forEach(item => {
                if (fAcc !== 'all' && item.acc !== fAcc) return;

                let match = true;
                if (fVar !== 'all') {
                    if (fType === 'exact') { match = (item.vars.length === 1 && item.vars[0] === fVar); }
                    else { match = item.vars.includes(fVar); }
                }
                if (match) results.push({ pName: prod.name, pIcon: prod.i, ...item });
            });
        });
        
        results.sort((a, b) => fSort === 'desc' ? b.w - a.w : a.w - b.w);
        document.getElementById('filter-count').innerText = results.length;
        document.getElementById('filter-list').innerHTML = results.map(it => `
            <div style="background:white; padding:15px; border-radius:15px; margin-bottom:12px; display:flex; align-items:center; border-bottom:3px solid #eee">
                <span style="font-size:32px; margin-right:15px;">${it.pIcon}</span>
                <div style="flex:1;">
                    <b style="color:var(--primary-nau); font-size: 16px;">${it.pName} | ${it.w}kg (x${it.q})</b>
                    <span class="acc-tag">${it.acc || 'Ẩn danh'}</span><br>
                    <small style="font-weight:800; font-size: 13px;">${it.vars.map(v => `<span class="${vColors[v]}">${v}</span>`).join(', ') || 'Thường'}</small>
                </div>
            </div>
        `).join('');
        
        closeFilterModal();
        document.getElementById('main-view').classList.remove('active-view');
        document.getElementById('filter-result-view').classList.add('active-view');
    }

    function openSub(n) { curF = inventory.find(x => x.name === n); document.getElementById('sub-title').innerText = curF.name; document.getElementById('main-view').classList.remove('active-view'); document.getElementById('sub-view').classList.add('active-view'); renderSubList(); }
    function closeSubView() { document.getElementById('sub-view').classList.remove('active-view'); document.getElementById('main-view').classList.add('active-view'); renderInv(); }

    function renderSubList() {
        const list = document.getElementById('sub-list');
        list.innerHTML = curF.items.map((it, i) => `
            <div style="background:white; padding:15px; border-radius:15px; margin-bottom:12px; display:flex; justify-content:space-between; align-items:center; border-bottom:3px solid #eee">
                <div>
                    <b style="color:var(--primary-nau); font-size: 16px;">${it.w}kg (x${it.q})</b>
                    <span class="acc-tag">${it.acc || 'Ẩn danh'}</span><br>
                    <small style="font-weight:800; font-size: 13px;">${it.vars.map(v => `<span class="${vColors[v]}">${v}</span>`).join(', ') || 'Thường'}</small>
                </div>
                <button onclick="delStock(${i})" style="background:#FF6B6B; box-shadow: 0 4px 0 #D15252; color:white; border:none; border-radius:10px; width:40px; height:40px; font-weight:800; font-size: 20px; cursor: pointer;">×</button>
            </div>
        `).join('');
    }

    function openAddStockModal() {
        if(accounts.length === 0) { alert("Vui lòng tạo ít nhất 1 tài khoản trước khi nhập hàng!"); return; }
        document.getElementById('modal-add-stock').style.display = 'flex';

        let accSelect = "";
        accounts.forEach(a => accSelect += `<option value="${a}">${a}</option>`);
        document.getElementById('add-stock-acc').innerHTML = accSelect;
        document.getElementById('add-variants').innerHTML = variants.map(v => `<div class="opt-item" onclick="this.classList.toggle('selected')"><span class="${vColors[v.n]}">${v.n}</span></div>`).join('');
    }
    function closeAddStockModal() { document.getElementById('modal-add-stock').style.display = 'none'; }

    function saveStock() {
        const acc = document.getElementById('add-stock-acc').value;
        const w = parseFloat(document.getElementById('add-w').value); const q = parseInt(document.getElementById('add-q').value);
        if(!w || q < 1 || !acc) return;
        const vs = Array.from(document.querySelectorAll('#add-variants .selected')).map(el => el.innerText.trim());
        curF.items.push({w, q, vars: vs, acc: acc}); closeAddStockModal(); renderSubList();
    }

    function delStock(i) { if(confirm("Xóa mục này khỏi kho?")) { curF.items.splice(i, 1); renderSubList(); } }
    
    function openCalcModal() {
        document.getElementById('modal-calc').style.display = 'flex';
        document.getElementById('calc-vars').innerHTML = variants.map(v => `<div class="opt-item cv-opt" data-t="${v.t}" data-v="${v.v}" onclick="this.classList.toggle('selected')"><span class="${vColors[v.n]}">${v.n}</span></div>`).join('');
        document.getElementById('calc-prods').innerHTML = products.map(p => `<div class="opt-item cp-opt" data-p="${p.p}" onclick="selP(this)">${p.i} ${p.name}</div>`).join('');
    }
    
    function selP(el) { document.querySelectorAll('.cp-opt').forEach(x => x.classList.remove('selected')); el.classList.add('selected'); }
    function switchTab(n) { document.querySelectorAll('.tab, .tab-content').forEach(x => x.classList.remove('active', 'active-content')); document.getElementById('tab-btn'+n).classList.add('active'); document.getElementById('tab'+n).classList.add('active-content'); }
    
    function execCalc() {
        const w = parseFloat(document.getElementById('calc-w').value);
        const pEl = document.querySelector('.cp-opt.selected');
        if(!w || !pEl) return;

        const friendCount = parseInt(document.getElementById('calc-f').value);
        const buffPercent = friendCount * 3;
        let rm = 1, eb = 0, vs = [];
        document.querySelectorAll('.cv-opt.selected').forEach(el => {
            vs.push(el.innerText.trim());
            el.dataset.t === 'r' ? rm *= parseFloat(el.dataset.v) : eb += parseFloat(el.dataset.v);
        });

        const res = Math.round(w * parseInt(pEl.dataset.p) * rm * (1 + eb) * (1 + (friendCount * 0.03)));
        calcHist.push({ n: pEl.innerText, w, vs, v: res, buff: buffPercent });
        renderCalcHistory();

        document.getElementById('calc-sum').innerText = calcHist.reduce((s, x) => s + x.v, 0).toLocaleString() + ' xu';
    }

    function clearCalc() {
        calcHist = [];
        renderCalcHistory();
        document.getElementById('calc-sum').innerText = '0 xu';
    }

    function renderCalcHistory() {
        document.getElementById('calc-history').innerHTML = calcHist.map((h, index) => `
            <div style="border-bottom:2px dashed #eee; padding:6px 0; margin-bottom: 4px; line-height: 1.5; display: flex; justify-content: space-between; align-items: center;">
                <div style="flex: 1; padding-right: 8px;">
                    ${h.n} (${h.w}kg)${h.vs.length ? ` [${h.vs.map(v => `<span class="${vColors[v]}">${v}</span>`).join(', ')}]` : ''}
                    ${h.buff > 0 ? `<span style="background: #E8F5E9; color: #2E7D32; padding: 1px 6px; border-radius: 6px; font-size: 11px; font-weight: 800; margin-left: 4px;">+${h.buff}% Bạn bè</span>` : ''}:
                    <b style="color:var(--primary-nau); font-size: 14px;">${h.v.toLocaleString()} xu</b>
                </div>
                <button onclick="deleteCalcItem(${index})" style="background: #FF6B6B; color: white; border: none; border-radius: 6px; width: 24px; height: 24px; font-weight: 900; font-size: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 2px 0 #D15252;">×</button>
            </div>
        `).join('');
    }

    function deleteCalcItem(index) {
        calcHist.splice(index, 1);
        renderCalcHistory();
        document.getElementById('calc-sum').innerText = calcHist.reduce((s, x) => s + x.v, 0).toLocaleString() + ' xu';
    }

    function closeCalcModal() { document.getElementById('modal-calc').style.display = 'none'; }
    
    const helpData = {
        acc: "Đây là nơi quản lý các acc cày nông sản của bạn.<br><br><span style='font-weight:900;color:#8B5E3C;'>• Thêm:</span> Nhập tên acc để tạo mới tài khoản.<br><span style='font-weight:900;color:#8B5E3C;'>• Xóa (×):</span> Hệ thống sẽ xóa sạch toàn bộ nông sản đang lưu thuộc acc này để giải phóng bộ nhớ.<br><span style='font-weight:900;color:#8B5E3C;'>• Sửa:</span> Đổi tên acc mà không làm mất số nông sản đã nhập trước đó.",
        calc: "Giúp ước tính nhanh giá trị nông sản trước khi thu hoạch:<br><br><span style='font-weight:900;color:#8B5E3C;'>• Biến thể:</span> Chọn các thuộc tính biến thể của nông sản cần cân.<br><span style='font-weight:900;color:#8B5E3C;'>• Nông sản:</span> Chọn loại nông sản cần cân.<br><span style='font-weight:900;color:#8B5E3C;'>• Cân nặng:</span> Nhập số kg của nông sản.<br><span style='font-weight:900;color:#8B5E3C;'>• Bạn bè:</span> Kéo thanh trượt theo số lượng bạn bè trong map (<span style='font-weight:900;color:#4CAF50;'>+3% giá trị</span> trên mỗi người bạn).<br>Bấm <span style='font-weight:900;color:#3B82F6;'>CÂN</span> để lưu kết quả cân vào lịch sử tính toán và cộng dồn vào Tổng giá xu ước tính phía dưới.<br>Bấm <span style='font-weight:900;color:#FF6B6B;'>XÓA</span> để xóa toàn bộ kết quả vừa cân",
        add: "Nhập thêm nông sản vào kho dữ liệu:<br><br><span style='font-weight:900;color:#8B5E3C;'>• Tài khoản:</span> Chọn chính xác Acc chứa nông sản đó để nhập.<br><span style='font-weight:900;color:#8B5E3C;'>• Cân nặng:</span> Nhập số kg của nông sản.<br><span style='font-weight:900;color:#8B5E3C;'>• Số lượng:</span> Nhập số lượng lớn nông sản (nếu trùng hiệu ứng và số kg).<br><span style='font-weight:900;color:#8B5E3C;'>• Biến thể:</span> Tích chọn các thuộc tính biến thể của nông sản.<br>Nhấn <span style='font-weight:900;color:#3B82F6;'>NHẬP</span> để thêm vào kho",
        filter: "Công cụ kiểm kho và lọc:<br><br><span style='font-weight:900;color:#8B5E3C;'>• Tài khoản:</span> Lọc theo từng tài khoản (mặc định là tất cả).<br><span style='font-weight:900;color:#8B5E3C;'>• Kiểu lọc:</span> Chọn <span style='font-weight:900;color:#8B5E3C;'>[Chỉ lọc]</span> (tìm nông sản chỉ có duy nhất 1 biến thể đó) hoặc <span style='font-weight:900;color:#8B5E3C;'>[Bao gồm]</span> (tìm tất cả nông sản có chứa biến thể đó)."
    };

    function showHelp(key) {
        document.getElementById('help-popup-content').innerHTML = helpData[key] || "Chưa có hướng dẫn cho mục này.";
        document.getElementById('modal-help-popup').style.display = 'flex';
    }
    function closeHelp() {
        document.getElementById('modal-help-popup').style.display = 'none';
    }

    // KHÓA CỨNG HÀNH VI CHỐNG PULL-TO-REFRESH BẰNG JS
    window.addEventListener('load', function() {
        const scrollableTargets = ['.grid-container', '#sub-list', '#filter-list'];
        
        scrollableTargets.forEach(selector => {
            const el = document.querySelector(selector);
            if (!el) return;

            let lastY = 0;
            el.addEventListener('touchstart', (e) => {
                lastY = e.touches[0].pageY;
            }, { passive: false });

            el.addEventListener('touchmove', (e) => {
                const y = e.touches[0].pageY;
                // Nếu đang ở đỉnh danh sách và vuốt xuống thì chặn cơ chế reload mặc định
                if (el.scrollTop === 0 && y > lastY) {
                    e.preventDefault();
                }
                lastY = y;
            }, { passive: false });
        });
    });

    renderInv();
// Hàm Xuất dữ liệu ra file .json
function exportData() {
    const data = {
        accounts: JSON.parse(localStorage.getItem('tuna_farm_accounts')) || [],
        inventory: JSON.parse(localStorage.getItem('tuna_farm_data')) || [],
        exportDate: new Date().toLocaleString('vi-VN')
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    a.href = url;
    a.download = `BackUp_KhoPTG_${new Date().toLocaleDateString().replace(/\//g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert("Đã xuất file sao lưu thành công vào máy!");
}

// Hàm Nhập dữ liệu từ file JSON vào App
function importData(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            // Kiểm tra cấu trúc file sao lưu
            if (data.accounts && data.inventory) {
                if (confirm("Dữ liệu hiện tại trên App sẽ bị xóa sạch và thay thế bằng dữ liệu từ file này. Bạn có chắc chắn không?")) {
                    localStorage.setItem('tuna_farm_accounts', JSON.stringify(data.accounts));
                    localStorage.setItem('tuna_farm_data', JSON.stringify(data.inventory));
                    alert("Khôi phục thành công! App sẽ tự động tải lại.");
                    location.reload(); 
                }
            } else {
                alert("Lỗi: File không đúng định dạng của Kho PTG!");
            }
        } catch (err) {
            alert("Lỗi: Không thể đọc được nội dung file này!");
        }
    };
    reader.readAsText(file);
    // Reset input để có thể chọn lại cùng 1 file nếu cần
    event.target.value = '';
}
