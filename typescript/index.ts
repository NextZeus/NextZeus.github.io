// primitive data types: string, number, boolean, undefined, null, symbol, bigint

// undefined 和 null 是所有类型的子类型, 也就是说 undefined 类型的变量，可以赋值给 number 类型的变量

// 类型推论 如果定义的时候没有赋值，不管之后有没有赋值，都会被推断成any类型而完全不被类型检查
let a; // 等价于 lat a: any;
a = 'string';
a = 7;

let b = 'string'; // 等价于 let b: string = 'string';
// b = 7; // Type 'number' is not assignable to type 'string'.

// 联合类型 Union Types, 表示取值可以为多种类型中的一种
// 只能访问此联合类型的所有类型里共有的属性或方法
let c: string | number;
c = 'string';
c = 0;
// c = true;  // Type 'boolean' is not assignable to type 'string | number'.

// 接口，用来定义对象的类型
interface IPerson {
	readonly name: string;
	age: number;
	// nextAge(): number; // class可以实现具体的行为
	[field: string]: any; // 一旦定义了任意属性，那么确定属性和可选属性的类型都必须是它的类型的子集
	// [field: string]: string; // 一旦定义了任意属性，那么确定属性和可选属性的类型都必须是它的类型的子集
	// Property 'nextAge' of type '() => number' is not assignable to string index type 'string'
	// Property 'age' of type 'number' is not assignable to string index type 'string'.
}

class Person implements IPerson {
	name: string; // 这里如果不是 readonly, 仍然是可以修改的
	age: number;
	nextAge(): number {
		return this.age + 1;
	}

	setName(name: string) {
		this.name = name;
	}
}

let person: Person = new Person();
person.setName('xxx')

let p: IPerson = {
	name: '',
	age: 0
};
// p.name = ''; // Cannot assign to 'name' because it is a read-only property.

// 数组的类型
// 「类型 + 方括号」表示法
let arr: number[] = [1, 2, 3, 4, 5];
// 数组泛型
let arr1: Array<number> = [1, 2, 3, 4, 5];


// 函数的类型
// 函数声明
function sum(x: number, y: number): number {
	return x + y
}

// 函数表达式
let mySum: (x: number, y: number) => number = function (x: number, y: number): number {
	return x + y;
}

// 用接口定义函数的形状
interface SearchFunc {
	(source: string, subString: string): boolean;
}
let mySearch: SearchFunc = function (source: string, subString: string) {
	return source.search(subString) !== -1;
}
// 可选参数 必须放在必需参数后面
// 参数默认值
// 剩余参数 ...rest 只能是最后一个参数
// 重载
function reverse(x: number): number; // 函数定义
function reverse(x: string): string; // 函数定义
// TypeScript 会优先从最前面的函数定义开始匹配，所以多个函数定义如果有包含关系，需要优先把精确的定义写在前面
function reverse(x: number | string): number | string | void { // 函数实现
	if (typeof x === 'number') {
		return Number(x.toString().split('').reverse().join(''));
	} else if (typeof x === 'string') {
		return x.split('').reverse().join('');
	}
}

// 类型断言 语法：值 as 类型 or <类型>值
// 类型声明 let xx: 类型
// 父类可以被断言为子类 子类可以被断言为父类 任何类型都可以被断言为any
interface Animal {
	name: string;
}
interface Cat {
	name: string;
	run(): void;
}
let tom: Cat = {
	name: 'Tom',
	run: () => { console.log('run'); }
}

let animal: Animal = tom;
// let cat: Cat = animal; // Property 'run' is missing in type 'Animal' but required in type 'Cat'.
let cat: Cat = animal as Cat;