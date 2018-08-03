---
layout: post
title: "java之LeetCode"
date: 2018-05-14
categories: Java
tags: Java
author: Quan Zhang
---

* content
{:toc} 

## 两数之和(哈希表)

给定一个整数数组和一个目标值，找出数组中和为目标值的两个数。

你可以假设每个输入只对应一种答案，且同样的元素不能被重复利用。

**示例:**

	给定 nums = [2, 7, 11, 15], target = 9

	因为 nums[0] + nums[1] = 2 + 7 = 9
	所以返回 [0, 1]

### 暴力法

时间复杂度：$O(n^2)$

空间复杂度：$O(1)$

```java
/*coding: GBK*/
import java.util.Arrays;
public class Add{
	public int[] twoSum(int[] nums,int target){
		for(int i=0;i<nums.length;i++){
			for(int j=i+1;j<nums.length;j++){
				if(nums[j]==target-nums[i]){
					return new int[]{i,j};
				}
			}
		}
		throw new IllegalArgumentException("No two sum solution");
	}
	public static void main(String[] args){
		//数组的表示
		int[] a = new int[]{1,2,3,4};
		int[] res = new int[2];
		res = new Add().twoSum(a,3);
		//静态方法调用非静态函数：1.new一个；2.加static
		System.out.println(Arrays.toString(res));
		//数组转字符串
	}
}
```

### 两次哈希表

时间复杂度：$O(n^2)$

空间复杂度：$O(n^2)$

```java
//两次哈希表
//寻找索引与对应数组元素的方法：哈希表
public class Add{
	public int[] twoSum(int[] nums, int target){
		Map<Integer, Integer> map = new HashMap<>();
		for(int i = 0;i<nums.length;i++){
			map.put(nums[i],i);
		}
		for(int i = 0;i<nums.length;i++){
			int complement = target - nums[i];
			if(map.containsKey(complement)&&map.get(complement)!=i){
				return new int[]{i,map.get(complement)};
			}
		}
		throw new IllegalArgumentException("No two sum solution!");
	}
	public static void main(String[] args){
		int[] a = new int[]{1,2,3,4};
		int[] res = new int[2];
		res = new Add().twoSum(a,3);
		System.out.println(Arrays.toString(res));
	}
}
```

### 一次哈希表

```java
public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> map = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (map.containsKey(complement)) {
            return new int[] { map.get(complement), i };
        }
        map.put(nums[i], i);
    }
    throw new IllegalArgumentException("No two sum solution");
}
```

### HashMap与HashSet

HashMap实现了Map接口，Map接口对键值对进行映射。Map中不允许出现重复的key。调用put（）向map中添加元素。

HashSet实现了Set接口，它不允许集合中出现重复元素。调用add（）方法向Set中添加元素。

HashMap使用键（Key）计算Hashcode。HashSet使用成员对象来计算hashcode值，对于两个对象来说hashcode可能相同，所以equals()方法用来判断对象的相等性，如果两个对象不同的话，那么返回false。

HashMap相对于HashSet较快，因为它是使用唯一的键获取对象。

`HashMap的原理？线程不安全时自然谈到ConcurrentHashMap，他的实现原理？`

## 两数相加(链表)

给定两个非空链表来表示两个非负整数。位数按照逆序方式存储，它们的每个节点只存储单个数字。将两数相加返回一个新的链表。

你可以假设除了数字 0 之外，这两个数字都不会以零开头。

**示例:**

	输入：(2 -> 4 -> 3) + (5 -> 6 -> 4)
	输出：7 -> 0 -> 8
	原因：342 + 465 = 807

```java
class ListNode {
     int val;
     ListNode next;
     ListNode(int x) { val = x; }
 }
public class Add {
	// 数组转链表
	public ListNode arrToListNode(int[] arr){
		ListNode dummyHead = new ListNode(0);
		ListNode curr = dummyHead;
		for(int i=0;i<arr.length;i++){
			curr.next = new ListNode(arr[i]);
			curr = curr.next;
			System.out.print(arr[i]);
		}
		System.out.println();
		return dummyHead.next;
	}
	// 打印链表
	public void printListNode(ListNode l){
		while(l != null){
			System.out.print(l.val);
			l=l.next;
		}
		System.out.println("");
	}
	// 两链表相加
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        ListNode dummyHead = new ListNode(0);
        ListNode p = l1, q = l2, curr = dummyHead;
        int carry = 0;
        while (p != null || q != null) {
            int x = (p != null) ? p.val : 0;
            int y = (q != null) ? q.val : 0;
            int sum = carry + x + y;
            carry = sum / 10;
            curr.next = new ListNode(sum % 10);
            curr = curr.next;
            if (p != null) p = p.next;
            if (q != null) q = q.next;
        }
        if (carry > 0) {
            curr.next = new ListNode(carry);
        }
        return dummyHead.next;
    }
    public static void main(String[] args){
    	int[] a1,a2;
    	a1 = new int[]{1,2,7,4};//数值4721
    	a2 = new int[]{3,6,4,8};//数值8463
    	ListNode l1,l2,l3;
    	l1 = new Add().arrToListNode(a1);
    	l2 = new Add().arrToListNode(a2);
    	l3 = new Add().addTwoNumbers(l1,l2);
    	new Add().printListNode(l3);
    	//打印链表48131(倒序)
    }
}
```

## 无重复字符的最长子串

给定一个字符串，找出不含有重复字符的最长子串的长度。

**示例：**

给定 `"abcabcbb"` ，没有重复字符的最长子串是 `"abc"` ，那么长度就是3。

给定 `"bbbbb"` ，最长的子串就是 `"b"` ，长度是1。

给定 `"pwwkew"` ，最长子串是 `"wke"` ，长度是3。请注意答案必须是一个子串，`"pwke"` 是 子序列  而不是子串。

### 暴力法(HashSet)

逐个检查所有的字符串，看它是否不含有重复的字符。

时间复杂度：$O(n^3)$

空间复杂度：$O(min(n,m))$

1.	使用 i 从 0 到 n−1 以及 j 从 i+1 到 n 这两个嵌套的循环，我们可以枚举出 s 的所有子字符串。

2.	使用`集合`，遍历字符串中的所有字符，并将它们逐个放入集合 set 中。在放置一个字符之前，我们检查该集合是否已经包含它。如果包含，我们会返回 false。循环结束后，我们返回 true。

```java
import java.util.*;
public class Solution{
	public static void main(String[] args){
		String s="aabcdeffgd";
		// 最长不重复为：abcdef
		int len = new Solution().lengthOfSubString(s);
		System.out.println("length is:"+len);
	}
	public int lengthOfSubString(String s){
		int ans = 0;
		for(int i=0;i<s.length();i++){
			for(int j=i+1;j<=s.length();j++){
				if(allUnique(s,i,j))
					ans = Math.max(ans,j-i);
			}
		}
		return ans;
	}
	public boolean allUnique(String s,int start,int end){
		Set<Character> set = new HashSet<>();
		for(int i=start;i<end;i++){
			Character ch = s.charAt(i);
			if(set.contains(ch))
				return false;
			set.add(ch);
		}
		return true;
	}
}
```

### 滑动窗口(HashSet)

时间复杂度：$O(n)$

空间复杂度：$O(min(n,m))$

```java
public class Solution {
    public int lengthOfLongestSubstring(String s) {
        int n = s.length();
        Set<Character> set = new HashSet<>();
        int ans = 0, i = 0, j = 0;
        while (i < n && j < n) {
            // try to extend the range [i, j]
            if (!set.contains(s.charAt(j))){
                set.add(s.charAt(j++));
                ans = Math.max(ans, j - i);
            }
            else {
                set.remove(s.charAt(i++));
            }
        }
        return ans;
    }
}
```

### 优化的滑动窗口(HashMap)

如果 s[j] 在 [i,j) 范围内有与 j1 重复的字符，我们不需要逐渐增加 i 。我们可以直接跳过 [i,j1] 范围内的所有元素，并将 i 变为 j1+1。

时间复杂度：$O(n)$

空间复杂度：$O(min(n,m))$

```java
public class Solution {
    public int lengthOfLongestSubstring(String s) {
        int n = s.length(), ans = 0;
        Map<Character, Integer> map = new HashMap<>();
        for (int j = 0, i = 0; j < n; j++) {
            if (map.containsKey(s.charAt(j))) {
                i = Math.max(map.get(s.charAt(j)), i);
            }
            ans = Math.max(ans, j - i + 1);
            map.put(s.charAt(j), j + 1);
        }
        return ans;
    }
}
```