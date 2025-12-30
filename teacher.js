// 老師頁面邏輯
let currentData = DataManager.loadData();

// 初始化頁面
function init() {
    renderTable();
    setupEventListeners();
}

// 渲染表格
function renderTable() {
    currentData = DataManager.loadData();
    const tableBody = document.getElementById('tableBody');
    const tableHeader = document.getElementById('tableHeader');

    // 清空表格
    tableBody.innerHTML = '';
    
    // 移除所有作業標題（保留學生姓名和操作列）
    const existingHeaders = tableHeader.querySelectorAll('.assignment-header');
    existingHeaders.forEach(header => header.remove());

    // 渲染作業標題（插入到學生姓名和操作列之間）
    const studentNameHeader = tableHeader.querySelector('th:first-child');
    const operationHeader = tableHeader.querySelector('th:last-child');
    
    currentData.assignments.forEach(assignment => {
        const th = document.createElement('th');
        th.className = 'assignment-header';
        th.textContent = assignment;
        th.innerHTML += ` <button class="btn-delete-assignment" onclick="deleteAssignment('${assignment}')" title="刪除作業">×</button>`;
        tableHeader.insertBefore(th, operationHeader);
    });

    // 渲染學生資料
    currentData.students.forEach(student => {
        const row = document.createElement('tr');
        
        // 學生姓名欄位
        const nameCell = document.createElement('td');
        nameCell.textContent = student;
        nameCell.className = 'student-name';
        row.appendChild(nameCell);

        // 作業狀態欄位
        currentData.assignments.forEach(assignment => {
            const cell = document.createElement('td');
            cell.className = 'assignment-cell';
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = DataManager.getStatus(student, assignment);
            checkbox.onchange = () => {
                DataManager.updateStatus(student, assignment, checkbox.checked);
                updateStats();
            };
            cell.appendChild(checkbox);
            row.appendChild(cell);
        });

        // 操作欄位
        const actionCell = document.createElement('td');
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '刪除';
        deleteBtn.className = 'btn btn-danger btn-small';
        deleteBtn.onclick = () => {
            if (confirm(`確定要刪除學生「${student}」嗎？`)) {
                DataManager.deleteStudent(student);
                renderTable();
                updateStats();
            }
        };
        actionCell.appendChild(deleteBtn);
        row.appendChild(actionCell);

        tableBody.appendChild(row);
    });

    updateStats();
}

// 設定事件監聽器
function setupEventListeners() {
    // 新增學生
    document.getElementById('addStudentBtn').onclick = () => {
        document.getElementById('addStudentModal').style.display = 'block';
        document.getElementById('studentNameInput').value = '';
        document.getElementById('studentNameInput').focus();
    };

    document.getElementById('confirmAddStudent').onclick = () => {
        const name = document.getElementById('studentNameInput').value.trim();
        if (name) {
            if (DataManager.addStudent(name)) {
                renderTable();
                closeModal('addStudentModal');
            } else {
                alert('該學生已存在！');
            }
        } else {
            alert('請輸入學生姓名！');
        }
    };

    document.getElementById('cancelAddStudent').onclick = () => {
        closeModal('addStudentModal');
    };

    // 新增作業
    document.getElementById('addAssignmentBtn').onclick = () => {
        document.getElementById('addAssignmentModal').style.display = 'block';
        document.getElementById('assignmentNameInput').value = '';
        document.getElementById('assignmentNameInput').focus();
    };

    document.getElementById('confirmAddAssignment').onclick = () => {
        const name = document.getElementById('assignmentNameInput').value.trim();
        if (name) {
            if (DataManager.addAssignment(name)) {
                renderTable();
                closeModal('addAssignmentModal');
            } else {
                alert('該作業已存在！');
            }
        } else {
            alert('請輸入作業名稱！');
        }
    };

    document.getElementById('cancelAddAssignment').onclick = () => {
        closeModal('addAssignmentModal');
    };

    // 清除所有資料
    document.getElementById('clearAllBtn').onclick = () => {
        if (confirm('確定要清除所有資料嗎？此操作無法復原！')) {
            DataManager.clearAll();
            renderTable();
        }
    };

    // 關閉模態框
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.onclick = function() {
            this.closest('.modal').style.display = 'none';
        };
    });

    // 點擊模態框外部關閉
    window.onclick = function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    };

    // Enter 鍵確認
    document.getElementById('studentNameInput').onkeypress = (e) => {
        if (e.key === 'Enter') {
            document.getElementById('confirmAddStudent').click();
        }
    };

    document.getElementById('assignmentNameInput').onkeypress = (e) => {
        if (e.key === 'Enter') {
            document.getElementById('confirmAddAssignment').click();
        }
    };
}

// 刪除作業
function deleteAssignment(assignmentName) {
    if (confirm(`確定要刪除作業「${assignmentName}」嗎？`)) {
        DataManager.deleteAssignment(assignmentName);
        renderTable();
        updateStats();
    }
}

// 關閉模態框
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// 更新統計資訊
function updateStats() {
    // 老師頁面不需要顯示統計，但保留函數以備擴展
}

// 頁面載入時初始化
window.onload = init;

