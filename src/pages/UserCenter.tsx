import { useState, type FC } from 'react';
import { UserOutlined, MessageOutlined, MoneyCollectOutlined, MailOutlined, ShoppingOutlined, TruckOutlined, } from '@ant-design/icons';
import { Menu } from 'antd';
import type { MenuProps } from 'antd';
import { useSearchParams } from 'react-router-dom';
import UserCenterPages from '../component/UserCenterPages/UserCenterPages';
import { useRequest } from 'ahooks';

/* ------------------------- 菜单数据 ------------------------- */

export type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
    {
        key: 'sub1',
        label: '账号中心',
        icon: <UserOutlined />,
        children: [
            { key: 'k1', label: '账号信息' },
            { key: 'k2', label: '更换邮箱', },
            { key: 'k3', label: '更改密码', },
            { key: 'k4', label: '设备管理', },
        ],
    },
    { type: 'divider' },
    {
        key: 'sub2',
        label: '我的商城',
        icon: <ShoppingOutlined />,
        children: [
            { key: '5', label: '我的订单' },
            { key: '6', label: '我的购物车' },
            { key: '7', label: '我的评价' },
            { key: '8', label: '我的吐槽' },
            { key: '9', label: '收货地址' },
        ],
    },
    {
        key: 'sub3',
        label: '售后服务',
        icon: <TruckOutlined />,
        children: [
            { key: '10', label: '我的售后' },
            { key: '11', label: '我的投诉' },
        ],
    },
    { type: 'divider' },
    {
        key: 'sub4',
        label: '我的资产',
        icon: <MoneyCollectOutlined />,
        children: [
            { key: '12', label: '我的优惠券' },
            { key: '13', label: '我的代金券' },
        ],
    },
    { type: 'divider' },
    {
        key: 'grp',
        label: '消息中心',
        type: 'group',
        children: [
            { key: '14', icon: <MailOutlined />, label: '系统通知' },
            { key: '15', icon: <MessageOutlined />, label: '我的咨询' },
        ],
    },
];

/* ------------------------- 官方示例：层级 key 计算 ------------------------- */
interface LevelKeysProps {
    key?: string;
    children?: LevelKeysProps[];
}

/**
 * 获取所有层级的键值映射
 * @param items - 包含层级信息的对象数组，每个对象应包含key和可选的children属性
 * @returns 返回一个对象，其中键是item.key，值是对应的层级深度（从1开始）
 * 
 * @example
 * const items = [
 *   { key: 'a' },
 *   { 
 *     key: 'b', 
 *     children: [
 *       { key: 'b1' }
 *     ]
 *   }
 * ];
 * const result = getLevelKeys(items);
 * // result: { a: 1, b: 1, b1: 2 }
 */
const getLevelKeys = (items: LevelKeysProps[]) => {
    const keyMap: Record<string, number> = {};

    /**
     * 递归遍历列表，记录每个key的层级深度
     * @param list - 要遍历的当前层级的项目列表
     * @param level - 当前层级深度，默认为1
     */
    const loop = (list: LevelKeysProps[], level = 1) => {
        list.forEach((item) => {
            if (item.key) keyMap[item.key] = level;
            if (item.children) loop(item.children, level + 1);
        });
    };

    loop(items);
    return keyMap;
};

const levelKeys = getLevelKeys(items as LevelKeysProps[]);




/* =========================== UserCenter 页面 ============================ */
const UserCenter: FC = () => {
    // const location = useLocation();
    // const fromStateKey = location.state?.selectedKey;
    const [searchParams] = useSearchParams();
    const fromStateKey = searchParams.get('selectedKey');

    const [refreshTrigger, setRefreshTrigger] = useState<number>(0);  // 刷新触发器


    /* ----------- 初始化：根据 fromStateKey 或默认 k1 ----------- */
    const [selectedKeys, setSelectedKeys] = useState<string[]>(() => {
        return fromStateKey ? [fromStateKey] : ['k1'];
    });

    /* ----------- 初始化：父级菜单自动展开 ----------- */
    const [openKeys, setOpenKeys] = useState<string[]>(() => {
        if (fromStateKey) {
            const parentKey = Object.entries(levelKeys)
                .find(([, level]) => level === levelKeys[fromStateKey] - 1)?.[0];

            return parentKey ? [parentKey] : ['sub1'];
        }
        return ['sub1'];
    });

    const { run: setRefresh } = useRequest(
        async (value: number) => {
            return new Promise<void>((resolve) => {
                setRefreshTrigger(value);
                resolve();
            });
        }, {
        manual: true,
        debounceLeading: true,
        debounceWait: 1000
    });
    /* ----------- 点击菜单项：切换选中 ----------- */
    const onClick: MenuProps['onClick'] = ({ key }) => {
        if (selectedKeys[0] === key) {
            // 点击相同菜单项时触发刷新

            setRefresh(refreshTrigger + 1);
        } else {
            setSelectedKeys([key]);
        }
    };

    /* ----------- 官方同款：同层级只展开一个 SubMenu ----------- */
    const onOpenChange: MenuProps['onOpenChange'] = (newOpenKeys) => {
        const latest = newOpenKeys.find((key) => !openKeys.includes(key));

        if (latest) {
            const conflictIndex = newOpenKeys
                .filter((k) => k !== latest)
                .findIndex((k) => levelKeys[k] === levelKeys[latest]);

            setOpenKeys(
                newOpenKeys
                    .filter((_, i) => i !== conflictIndex)
                    .filter((key) => levelKeys[key] <= levelKeys[latest])
            );
        } else {
            setOpenKeys(newOpenKeys);
        }
    };

    return (
        <div className="bg-[#f5f5f5] w-full">
            <div className="w-[1200px] mx-auto pt-5 flex justify-start">
                <div className="bg-white">
                    <Menu
                        className="bg-white h-auto min-h-[90vh] shadow-lg w-[256px]"
                        mode="inline"
                        items={items}
                        selectedKeys={selectedKeys}
                        openKeys={openKeys}
                        onClick={onClick}
                        onOpenChange={onOpenChange}
                    />
                </div>

                <UserCenterPages key={refreshTrigger} selectedKey={selectedKeys[0]} />
            </div>
        </div>
    );
};

export default UserCenter;
