import React, { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/firebase-config';
import './Reports.css';

const Reports = () => {
  const [items, setItems] = useState([]);
  const [groupBy, setGroupBy] = useState('college');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleGroups, setVisibleGroups] = useState({});
  const [zoomedImageId, setZoomedImageId] = useState(null); // State to track which image is zoomed

  useEffect(() => {
    const fetchItems = async () => {
      const itemsCollection = collection(db, 'items');
      const unsubscribe = onSnapshot(itemsCollection, (snapshot) => {
        const fetchedItems = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setItems(fetchedItems);
      });

      return () => unsubscribe();
    };

    fetchItems();
  }, []);

  const filterItems = (items) => {
    return items.filter((item) => {
      const lowerCaseQuery = searchQuery.toLowerCase();
      return (
        item.text.toLowerCase().includes(lowerCaseQuery) ||
        item.college.toLowerCase().includes(lowerCaseQuery) ||
        item.itemType.toLowerCase().includes(lowerCaseQuery)
      );
    });
  };

  const groupItems = () => {
    const filteredItems = filterItems(items);
    const grouped = filteredItems.reduce((acc, item) => {
      const collegeKey = item.college || 'Unknown';
      const categoryKey = item.itemType || 'Unknown Category';

      if (!acc[collegeKey]) {
        acc[collegeKey] = {};
      }

      if (!acc[collegeKey][categoryKey]) {
        acc[collegeKey][categoryKey] = [];
      }

      acc[collegeKey][categoryKey].push(item);
      return acc;
    }, {});

    return grouped;
  };

  const handleToggleGroup = (collegeKey, categoryKey) => {
    setVisibleGroups((prev) => ({
      ...prev,
      [`${collegeKey}-${categoryKey}`]: !prev[`${collegeKey}-${categoryKey}`],
    }));
  };

  const handleImageClick = (id) => {
    setZoomedImageId(zoomedImageId === id ? null : id); // Toggle zoomed state for the clicked image
  };

  const groupedItems = groupItems();

  return (
    <div className="reports-container">
      <h1>Items Report</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by item, college, or category"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="group-by-selector">
        <label>
          Group by:
          <select value={groupBy} onChange={(e) => setGroupBy(e.target.value)}>
            <option value="college">College</option>
            <option value="date">Date</option>
            <option value="itemType">Category</option>
          </select>
        </label>
      </div>
      {Object.keys(groupedItems).map((collegeKey) => (
        <div key={collegeKey} className="report-section">
          <h2>{collegeKey}</h2>
          {Object.keys(groupedItems[collegeKey]).map((categoryKey) => (
            <div key={categoryKey}>
              <h3>
                <button onClick={() => handleToggleGroup(collegeKey, categoryKey)} className="toggle-button">
                  {visibleGroups[`${collegeKey}-${categoryKey}`] ? 'Hide' : ''} {categoryKey}
                </button>
              </h3>
              {visibleGroups[`${collegeKey}-${categoryKey}`] && (
                <ul>
                  {groupedItems[collegeKey][categoryKey].map((item) => (
                    <li key={item.id}>
                      <div><strong>Item:</strong> {item.text}</div>
                      <div><strong>Quantity:</strong> {item.quantity}</div>
                      <div><strong>Amount:</strong> ${item.amount.toFixed(2)}</div>
                      <div><strong>Requested Date:</strong> {new Date(item.requestedDate.seconds * 1000).toLocaleDateString()}</div>
                      <div><strong>Supplier:</strong> {item.supplier}</div>
                      <div><strong>Type:</strong> {item.itemType}</div>
                      {item.image && (
                        <img
                          src={item.image}
                          alt="Item"
                          className={`report-image ${zoomedImageId === item.id ? 'zoomed' : ''}`}
                          onClick={() => handleImageClick(item.id)}
                        />
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Reports;
