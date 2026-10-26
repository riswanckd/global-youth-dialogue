import dns.resolver
import pymongo
import json
import os

dns.resolver.default_resolver = dns.resolver.Resolver(configure=False)
dns.resolver.default_resolver.nameservers = ['8.8.8.8', '1.1.1.1']

uri = 'mongodb+srv://risilbinmusthafa_db_user:BHUP8wJFLfuMClxJ@cluster0.dxecfdk.mongodb.net/gyde?retryWrites=true&w=majority'
client = pymongo.MongoClient(uri, serverSelectionTimeoutMS=8000)
db = client['gyde']

def serialize_doc(d):
    res = {}
    for k, v in d.items():
        if k == 'passwordHash':
            continue
        if hasattr(v, '__str__'):
            res[k] = str(v)
        else:
            res[k] = v
    return res

users = [serialize_doc(u) for u in db['users'].find({})]
apps = [serialize_doc(a) for a in db['applications'].find({})]

output_path = os.path.join(os.path.dirname(__file__), '..', 'view_database.html')

html_template = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>GYDE - Live Database Viewer</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0b1120; color: #f8fafc; margin: 0; padding: 32px; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; border-bottom: 1px solid #1e293b; padding-bottom: 20px; }
        h1 { color: #38bdf8; margin: 0 0 6px 0; font-size: 24px; }
        p { color: #94a3b8; margin: 0; font-size: 14px; }
        .tabs { display: flex; gap: 10px; margin-bottom: 20px; }
        .tab-btn { background: #1e293b; color: #94a3b8; border: 1px solid #334155; padding: 9px 18px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px; }
        .tab-btn.active { background: #0284c7; color: white; border-color: #38bdf8; }
        .search-box { width: 100%; max-width: 440px; padding: 11px 16px; background: #1e293b; border: 1px solid #334155; border-radius: 8px; color: white; margin-bottom: 20px; font-size: 14px; outline: none; }
        .search-box:focus { border-color: #38bdf8; }
        .table-container { background: #131d33; border: 1px solid #1e293b; border-radius: 10px; overflow-x: auto; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3); }
        table { width: 100%; border-collapse: collapse; font-size: 13px; }
        th, td { padding: 13px 18px; text-align: left; border-bottom: 1px solid #1e293b; }
        th { background: #0f172a; color: #94a3b8; text-transform: uppercase; font-size: 11px; letter-spacing: 0.05em; font-weight: 700; }
        tr:hover td { background: #1e293b; }
        .badge { display: inline-block; padding: 3px 8px; border-radius: 9999px; font-size: 11px; font-weight: 700; }
        .badge-active { background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3); }
        .badge-pending { background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3); }
        .badge-rejected { background: rgba(244, 63, 94, 0.15); color: #fb7185; border: 1px solid rgba(244, 63, 94, 0.3); }
        .badge-role { background: rgba(56, 189, 248, 0.15); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3); }
    </style>
</head>
<body>
    <div class="header">
        <div>
            <h1>GYDE Live Database Viewer</h1>
            <p>Direct view from live MongoDB Atlas database (<code>gyde</code>)</p>
        </div>
    </div>
    
    <div class="tabs">
        <button class="tab-btn active" id="tab-users-btn" onclick="switchTab('users')">Users ({{USER_COUNT}})</button>
        <button class="tab-btn" id="tab-apps-btn" onclick="switchTab('apps')">Applications ({{APP_COUNT}})</button>
    </div>

    <input type="text" id="search" class="search-box" placeholder="Search by name, email, or country..." onkeyup="filterData()">

    <div id="users-view" class="table-container">
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Country</th>
                    <th>Organization</th>
                    <th>Created At</th>
                </tr>
            </thead>
            <tbody id="users-tbody"></tbody>
        </table>
    </div>

    <div id="apps-view" class="table-container" style="display:none;">
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Country</th>
                    <th>Status</th>
                    <th>Organization</th>
                    <th>Created At</th>
                </tr>
            </thead>
            <tbody id="apps-tbody"></tbody>
        </table>
    </div>

    <script>
        const users = {{USERS_JSON}};
        const apps = {{APPS_JSON}};

        function renderUsers(list) {
            const tbody = document.getElementById('users-tbody');
            tbody.innerHTML = list.map(u => `
                <tr>
                    <td><strong>${u.name || '-'}</strong></td>
                    <td>${u.email || '-'}</td>
                    <td><span class="badge badge-role">${u.role || '-'}</span></td>
                    <td><span class="badge badge-${u.status === 'active' ? 'active' : 'pending'}">${u.status || '-'}</span></td>
                    <td>${u.country || '-'}</td>
                    <td>${u.organization || '-'}</td>
                    <td>${u.createdAt ? u.createdAt.slice(0, 10) : '-'}</td>
                </tr>
            `).join('');
        }

        function renderApps(list) {
            const tbody = document.getElementById('apps-tbody');
            tbody.innerHTML = list.map(a => `
                <tr>
                    <td><strong>${a.name || '-'}</strong></td>
                    <td>${a.email || '-'}</td>
                    <td>${a.phone || '-'}</td>
                    <td>${a.country || '-'}</td>
                    <td><span class="badge badge-${a.status === 'approved' ? 'active' : (a.status === 'rejected' ? 'rejected' : 'pending')}">${a.status || '-'}</span></td>
                    <td>${a.organization || '-'}</td>
                    <td>${a.createdAt ? a.createdAt.slice(0, 10) : '-'}</td>
                </tr>
            `).join('');
        }

        let currentTab = 'users';
        function switchTab(tab) {
            currentTab = tab;
            document.getElementById('tab-users-btn').classList.toggle('active', tab === 'users');
            document.getElementById('tab-apps-btn').classList.toggle('active', tab === 'apps');
            document.getElementById('users-view').style.display = tab === 'users' ? 'block' : 'none';
            document.getElementById('apps-view').style.display = tab === 'apps' ? 'block' : 'none';
            filterData();
        }

        function filterData() {
            const q = document.getElementById('search').value.toLowerCase();
            if (currentTab === 'users') {
                const filtered = users.filter(u => 
                    (u.name && u.name.toLowerCase().includes(q)) ||
                    (u.email && u.email.toLowerCase().includes(q)) ||
                    (u.country && u.country.toLowerCase().includes(q)) ||
                    (u.role && u.role.toLowerCase().includes(q))
                );
                renderUsers(filtered);
            } else {
                const filtered = apps.filter(a => 
                    (a.name && a.name.toLowerCase().includes(q)) ||
                    (a.email && a.email.toLowerCase().includes(q)) ||
                    (a.country && a.country.toLowerCase().includes(q))
                );
                renderApps(filtered);
            }
        }

        renderUsers(users);
        renderApps(apps);
    </script>
</body>
</html>
"""

rendered_html = (
    html_template
    .replace('{{USER_COUNT}}', str(len(users)))
    .replace('{{APP_COUNT}}', str(len(apps)))
    .replace('{{USERS_JSON}}', json.dumps(users))
    .replace('{{APPS_JSON}}', json.dumps(apps))
)

with open(output_path, 'w', encoding='utf-8') as f:
    f.write(rendered_html)

print("Generated view_database.html successfully!")
