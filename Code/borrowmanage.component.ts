import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DocumentArchive } from 'app/models/DocumentArchive';
import { Registrasionlist } from 'app/models/Registrasionlist';
import { Record } from 'app/models/Record';
import { DatePipe } from '@angular/common';
import { BorrowmanageService } from './borrowmanage.service';
import { ConfigService } from '@core';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
import { MtxDialog, MtxGridColumn } from '@ng-matero/extensions';
import { CreateRegistrasionlistComponent } from './registrasionlist/registrasionlist-form.component';
import { CreateDocofrequestComponent } from './docofrequest/docofrequest-form.component';
import { CreateRenewalprofileComponent } from './renewalprofile/renewalprofile-form.component.';
import { CreatePayrecordComponent } from './renewalprofile/payrecord-form.component';
import { CreateReturncordComponent } from './renewalprofile/returncord-form.component';
import { CreateRequestComponent } from './renewalprofile/request-form.component';
import { CreateViewListComponent } from './list/view-list-form.component';
import { CreateAddinformationComponent } from './list/addinformation-form.component';
import { CreateShowAllComponent } from './list/showAll-form.component';
import { Docofrequest } from 'app/models/Docofrequest';
import { style } from '@angular/animations';
@Component({
  selector: 'app-borrowmanage',
  templateUrl: './borrowmanage.component.html',
  styleUrls: ['./borrowmanage.component.scss']
})
export class BorrowmanageComponent implements OnInit {
  columns: MtxGridColumn[] = [

    { header: 'Số phiếu', field: 'Votes', width: '120px', sortable: true },
    { header: 'Hồ sơ đăng ký', field: 'Title', width: '120px', sortable: true, },
    { header: 'Ngày đăng ký', field: 'CreatedDate', width: '120px', sortable: true, type: 'date', typeParameter: { format: 'dd/MM/yyyy', }},
    { header: 'Ngày hẹn trả', field: 'AppointmentDate', width: '120px', sortable: true, type: 'date', typeParameter: { format: 'dd/MM/yyyy', }},
    { header: 'Ngày trả hồ sơ', field: 'ReimburseDate', width: '120px', sortable: true, type: 'date', typeParameter: { format: 'dd/MM/yyyy', }},
    { header: 'Trạng thái',
    field: 'Status',
    type: 'tag',
    width: '120px',

    tag: {
      0:   { text: 'Mới đăng ký', color: 'green-100' },
      1: { text: 'Gửi yêu cầu đăng ký', color: 'red-100' },
      2: { text: 'Chờ phê duyệt', color: 'red-100' },
      3: { text: 'Đã trả hết', color: 'red-100' },
      4: { text: 'Đã trả một phần', color: 'red-100' },
      5: { text: 'Đã hủy', color: 'red-100' },
      6: { text: 'Đang mượn', color: 'green-100' },
    },
  },
    {
      header: 'Chức Năng',
      field: 'option',
      width: '50px',
      pinned: 'right',
      right: '0px',
      type: 'button',
      buttons: [
        {
          icon: 'forward_10np',
          tooltip: 'Chuyển dữ liệu',
          type: 'icon',
          click: record => this.cretedRegistrasionlist(record),
          iif:record => record.Status == 6 || record.Status == 2 ? false : true
          
        },
        {
          icon: 'edit',
          tooltip: 'Cập Nhật',
          type: 'icon',
          click: record => this.editRegistrasionlist(record),
          iif:record => record.Status == 6 ? false : true
        },
        {
          icon: 'alarm_add',
          tooltip: 'Gia hạn hồ sơ',
          type: 'icon',
          click: record => this.editRenewalprofile(record),
          iif:record => record.Status == 0 || record.Status == 2 ? false : true
        },
        {
          icon: 'remove_red_eye',
          tooltip: 'Thông tin phiếu mượn',
          type: 'icon',
          click: record => this.viewList(record),
        },

      ],
    },
  ];

  Listcolumns: MtxGridColumn[] = [

    { header: 'Số phiếu', field: 'Votes', width: '120px', sortable: true },
    { header: 'Người mượn', field: 'FullName', width: '120px', sortable: true, },
    { header: 'Hồ sơ mượn', field: 'Title', width: '120px', sortable: true },
    { header: 'Ngày hẹn trả', field: 'AppointmentDate', width: '120px', sortable: true ,type: 'date', typeParameter: { format: 'dd/MM/yyyy', }},
    { header: 'Trạng thái',
    field: 'Status',
    type: 'tag',
    width: '120px',

    tag: {
      0:   { text: 'Mới đăng ký', color: 'green-100' },
      1: { text: 'Gửi yêu cầu đăng ký', color: 'red-100' },
      2: { text: 'Chờ phê duyệt', color: 'red-100' },
      3: { text: 'Đã trả hết', color: 'red-100' },
      4: { text: 'Đã trả một phần', color: 'red-100' },
      5: { text: 'Đã hủy', color: 'red-100' },
      6: { text: 'Đã qua phê duyệt', color: 'red-100' },
    },
  },
    {
      header: 'Chức Năng',
      field: 'option',
      width: '50px',
      pinned: 'right',
      right: '0px',
      type: 'button',
      buttons: [
        
        {
          icon: 'swap_horizontal_circle', 
          tooltip: 'Xác nhận phiếu mượn',
          type: 'icon',
          click: record => this.viewList(record),
        },

      ],
    },
  ];

  renewalprofilecolumns: MtxGridColumn[] = [

    { header: 'Số phiếu mượn', field: 'Votes', width: '100px', hide: true },
    { header: 'Người mượn', field: 'FullName', width: '200px', sortable: true ,},
    { header: 'Hồ sơ mượn', field: 'Title', width: '200px', sortable: true ,},
    { header: 'Ngày mượn', field: 'BorrowDate', width: '200px', sortable: true ,type: 'date', typeParameter: { format: 'dd/MM/yyyy', } },
    { header: 'Ngày hẹn trả', field: 'AppointmentDate', width: '200px', sortable: true ,type: 'date', typeParameter: { format: 'dd/MM/yyyy', } },
    { header: 'Ngày gia hạn', field: 'ExtendDate', width: '200px', sortable: true ,type: 'date', typeParameter: { format: 'dd/MM/yyyy', } },
    {
      header: 'Chức Năng',
      
      field: 'option',
      width: '120px',
      pinned: 'right',
      right: '0px',
      type: 'button',
      buttons: [
        {
          icon: 'add_circle_outline',
          tooltip: 'Nhập thông tin người đến mượn',
          type: 'icon',
          click: record => this.AddList(record),
        },
        {
          icon: 'note_add ',
          tooltip: 'Gia hạn hồ sơ',
          type: 'icon',
          click: record => this.editRenewalprofile(record),
        },
        {
          icon: 'assignment',
          tooltip: 'Trả hồ sơ',
          type: 'icon',
          click: record => this.editPayrecord(record),
        },
        {
          icon: 'speaker_notes',
          tooltip: 'Yêu cầu trả hồ sơ',
          type: 'icon',
          click: record => this.editReturncord(record),
        },
        {
          icon: 'speaker_notes_off',
          tooltip: 'Thu hồi yêu cầu trả hồ sơ',
          type: 'icon',
          click: record => this.editRequest(record),
        },
        {
          icon: 'remove_red_eye',
          tooltip: 'Xem chi tiết phiếu mượn',
          type: 'icon',
          click: record => this.ViewAll(record),
        },
      ],
    },
  ];

  Docofrequestcolumns: MtxGridColumn[] = [

    { header: 'Tên hồ sơ', field: 'Title', width: '120px', sortable: true },
    { header: 'Số phiếu', field: 'Votes', width: '120px', sortable: true },
    { header: 'Người mượn', field: 'FullName', width: '120px', sortable: true, },
    { header: 'Ngày mượn', field: 'ReceiveDate', width: '120px', sortable: true, type: 'date', typeParameter: { format: 'dd/MM/yyyy ', } },
    { header: 'Ngày hẹn trả', field: 'AppointmentDate', width: '120px', sortable: true, type: 'date', typeParameter: { format: 'dd/MM/yyyy', } },
    { header: 'Ngày trả', field: 'ReimburseDate', width: '120px', sortable: true, type: 'date', typeParameter: { format: 'dd/MM/yyyy ', } },
    {
      header: 'Trạng thái',
      field: 'Status',
      type: 'tag',
      width: '120px',

      tag: {
        0: { text: 'Mới đăng ký', color: 'green-100' },
        1: { text: 'Gửi yêu cầu đăng ký', color: 'red-100' },
        2: { text: 'Đã phê duyệt', color: 'red-100' },
        3: { text: 'Đã trả hết', color: 'red-100' },
        4: { text: 'Đã trả một phần', color: 'red-100' },
        5: { text: 'Đã hủy', color: 'red-100' },
        6: { text: 'Đã qua phê duyệt', color: 'red-100' },
      },
     },
    {
      header: 'Chức Năng',
      field: 'option',
      width: '50px',
      pinned: 'right',
      right: '0px',
      type: 'button',
      buttons: [


        {
          icon: 'remove_red_eye',
          tooltip: 'Xem chi tiết',
          type: 'icon',
          click: record => this.Viewdocofrequest(record),
        },
      ],
    },
  ];

  Logbookborrowedcolumns: MtxGridColumn[] = [

    { header: 'Ngày mượn', field: 'ReceiveDate', width: '150px', sortable: true, type: 'date', typeParameter: { format: 'dd/MM/yyyy', } },
    { header: 'Tên hồ sơ mượn', field: 'Title', width: '150px', sortable: true ,},
    { header: 'Người mượn', field: 'FullName',width: '150px', sortable: true },
    { header: 'Ngày hẹn trả', field: 'AppointmentDate',width: '150px', sortable: true , type: 'date', typeParameter: { format: 'dd/MM/yyyy', }},
    { header: 'Ngày trả', field: 'ReimburseDate',width: '150px',sortable: true , type: 'date', typeParameter: { format: 'dd/MM/yyyy', }},
    { header: 'Trạng thái',
    field: 'Status',
    type: 'tag',
    width: '120px',

    tag: {
    0:   { text: 'Mới đăng ký', color: 'green-100' },
      1: { text: 'Gửi yêu cầu đăng ký', color: 'red-100' },
      2: { text: 'Chờ phê duyệt', color: 'red-100' },
      3: { text: 'Đã trả hết', color: 'red-100' },
      4: { text: 'Đã trả một phần', color: 'red-100' },
      5: { text: 'Đã hủy', color: 'red-100' },
      6: { text: 'Đang mượn', color: 'red-100' },
    },
  },
    {
      header: 'Chức Năng',
      field: 'option',
      width: '50px',
      pinned: 'right',
      right: '0px',
      type: 'button',
      buttons: [

        // {
        //   icon: 'delete',
        //   tooltip: 'Hủy phiếu mượn',
        //   color: 'warn',
        //   type: 'icon',
        //   pop: true,
        //   popTitle: 'Xác nhận hủy ?',
        //   click: record => this.Delete(record),
        // },
        {
          icon: 'remove_red_eye',
          tooltip: 'Xem chi tiết',
          type: 'icon',
          click: record => this.Viewdocofrequest(record),
        },
      ],
    },
  ];

  list = [];
  total = 0;
  isLoading = false;
  viewId: number;
  message: string;
  disableButton: boolean = true;
  disable: boolean = true;
  showSearch = false;
  Registrasionlist: Registrasionlist;
  docofrequest: Docofrequest;
  activeRegistrasionlist: any;
  provinceList: any;
  fondList: any;
  fileList: any;
  RegisList: any;
  apiBaseUrl: String;
  listReigstration: any;
  query = {
    Status:null,
    KeyWord: '',
    PageIndex: 0,
    PageSize: 20,
    SortField: '',
    SortDirection: 'desc',
    DateAddStart: '',
    DateAddEnd: '',
    logbookborrowedForm: null,
    ReceiveDate: null,
    Title: null,
    ReceiverName: null,
    AppointmentDate: null,
    ReimburseDate: null,

  };
  listarray: any;

  get params() {
    const p = Object.assign({}, this.query);
    p.PageIndex += 1;
    return p;
  }

  constructor(private borrowmanageService: BorrowmanageService,
    private config: ConfigService,
    public _MatPaginatorIntl: MatPaginatorIntl,
    private cdr: ChangeDetectorRef,
    public datepipe: DatePipe,
    private toastr: ToastrService,
    public dialog: MtxDialog) {
    this._MatPaginatorIntl.getRangeLabel = (page: number, pageSize: number, length: number) => {
      if (length === 0 || pageSize === 0) {
        return `0 của ${length}`;
      }
      length = Math.max(length, 0);
      const startIndex = page * pageSize;
      // If the start index exceeds the list length, do not try and fix the end index to the end.
      const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
      return `${startIndex + 1} - ${endIndex} của ${length}`;
    };
    var conf = this.config.getConfig();
    this.query.PageSize = conf.pageSize;
    this.docofrequest = new Docofrequest();
    this.apiBaseUrl = conf.apiBaseUrl;
    

  }
  StatisticalReportAssets() {
    if (this.query.logbookborrowedForm == null || this.query.logbookborrowedForm == undefined) { this.query.logbookborrowedForm = 0 }
    if (this.query.ReceiveDate == null || this.query.ReceiveDate == undefined) { this.query.ReceiveDate = 0 }
    if (this.query.Title == null || this.query.Title == undefined) { this.query.Title = 0 }
    if (this.query.ReceiverName == null || this.query.ReceiverName == undefined) { this.query.ReceiverName = 0 }
    if (this.query.AppointmentDate == null || this.query.AppointmentDate == undefined) { this.query.AppointmentDate = 0 }
    if (this.query.ReimburseDate == null || this.query.ReimburseDate == undefined) { this.query.ReimburseDate = 0 }
    if (this.query.Status == null || this.query.Status == undefined) { this.query.Status = 0 }
    var start = this.datepipe.transform(this.query.DateAddStart, 'yyyy-MM-dd')
    var end = this.datepipe.transform(this.query.DateAddEnd, 'yyyy-MM-dd')
    if (start == '' || start == null) {
      start = '1990-01-01'
    }
    if (end == '' || end == null) {

      end = this.datepipe.transform(Date.now(), 'yyyy-MM-dd')
    }
    window.open(`${this.apiBaseUrl}report/DownloadExcelStatisAccessmonitor?logbookborrowedForm=${this.query.logbookborrowedForm}&ReceiveDate=${this.query.ReceiveDate}&Title=${this.query.Title}&ReceiverName=${this.query.ReceiverName}&AppointmentDate=${this.query.AppointmentDate}&ReimburseDate=${this.query.ReimburseDate}&Status=${this.query.Status}&start=${start}&end=${end}`);

  }

  ngOnInit() {
    this.getData();
    this.getSearchData();
    this._MatPaginatorIntl.itemsPerPageLabel = 'Bản.ghi:';
  }

  tabChanged($event) {
    var status = 0;
    if ($event.tab.textLabel == "Danh sách đăng ký hồ sơ") {
      status = 0;
      this.query.KeyWord = '';
    } else if ($event.tab.textLabel == "Danh sách phiếu mượn") {
      status = 2;
      this.query.KeyWord = '';
    } else if ($event.tab.textLabel == "Mượn - Trả - gia hạn hồ sơ") {
      status = 6;
      this.query.KeyWord = '';
    } else if ($event.tab.textLabel == "Lịch sử trả hồ sơ") {
      status = 3;
      this.query.KeyWord = '';
    } else if ($event.tab.textLabel == "Sổ theo dõi tài liệu mượn") {
      status = 3;
      this.query.KeyWord = '';
    }

    this.query.Status = status;
    this.getData();
  }

  getData() {
    this.isLoading = true;
    this.borrowmanageService.getByPage(this.params).subscribe((res: any) => {
      this.list = res.Data.ListObj;
      this.total = res.Data.Pagination.NumberOfRows;
      this.isLoading = false;
      this.cdr.detectChanges();
    });
    if (this.listReigstration = []) {
      this.disableButton = true;
    }
    if (this.RegisList = []) {
      this.disable = true;
    }
  }

  rowselectRegis(e: any) {
    this.RegisList = e;
    if (this.RegisList != 0) {
        this.disable = false;
    } else {
        this.disable = true;
    }
}
  getNextPage(e: PageEvent) {
    this.query.PageIndex = e.pageIndex;
    this.query.PageSize = e.pageSize;
    this.getData();
  }

  getSearchData() {
    this.getData();
  }


  clearsearch() {

    this.query.PageIndex = 0;
    this.query.KeyWord = '';

    this.query.SortField = '';
    this.query.SortDirection = 'desc';
    this.getData();
  }

  search() {
    this.query.PageIndex = 0;
    this.getData();
  }

  changeSort(e: any) {
    this.query.SortField = e.active;
    this.query.SortDirection = e.direction;
    this.search();
  }

  rowSelectionChangeLog(value: any) {
    this.listReigstration = value;
    if (value > 0) {
      this.disableButton = true;
    } else {
      this.disableButton = false;
    }
  }

  deleteRegistrasionlist(value: any) {
    this.borrowmanageService.deleteRegistrasionlist({ Id: value.Id }).subscribe((data: any) => {
      this.toastr.success(`Đã xoá ${value.RegistrasionlistName}!`);
    });
    this.getData();

  }

  cretedRegistrasionlist(value: any) {
    this.dialog.confirm('Bạn có xác nhận gửi yêu cầu mượn hồ sơ ?', () => {
      var data = { Id: value.Id };
      // console.log(data); 
      this.borrowmanageService.ChangeRegistrasionlist(data).subscribe((data: any) => {
        this.toastr.success(`Đã chuyển vào danh sách phiếu mượn`);
        this.getData();
      });
    })

  }

  newRegistrasionlist() {
    this.setViewId(0);
    const dialogRef = this.dialog.originalOpen(CreateRegistrasionlistComponent, {
      width: '1220px',
      data: { viewId: 0 },
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result == "1") this.getData();
    });
  }

  newCancel() {debugger
    this.dialog.confirm('Bạn có muốn hủy phiếu mượn', () => {
      var listRegistrasionlists = [];
      var Registrasionlistss = [];
      for (var i = 0; i < this.listReigstration.length; i++) {
        var Registrasionlists = this.listReigstration[i];
        Registrasionlistss.push(Registrasionlists);
        var list = Registrasionlistss[i].Id;
        listRegistrasionlists.push(list);
      }
      var data = {
        ListRegistrasionlist_Cancel: listRegistrasionlists
      };
      this.borrowmanageService.DeleteAll(data).subscribe((data: any) => {
        this.toastr.success(`Đã hủy phiếu mượn thành công!`);
        this.getData();
      });
    })
  }

  setViewId(id) {
    this.viewId = id;
  }


  ReturnTheRecords() {

    this.setViewId(0);
    const dialogRef = this.dialog.originalOpen(CreateRegistrasionlistComponent, {
      width: '800px',
      data: { viewId: 0 },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result == "1") this.getData();
    });
  }

  editRegistrasionlist(value: any) {
    this.setViewId(value.Id);
    const dialogRef = this.dialog.originalOpen(CreateRegistrasionlistComponent, {
      width: '1200px',
      data: { viewId: value.Id },
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result == "1") this.getData();
    });

  }
  editRenewalprofile(value: any) {
    this.setViewId(value.Id);
    const dialogRef = this.dialog.originalOpen(CreateRenewalprofileComponent, {
      width: '1000px',
      data: { viewId: value.Id },
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result == "1") this.getData();
    });
  }
  editPayrecord(value: any) {debugger
    this.setViewId(value.Id);
    const dialogRef = this.dialog.originalOpen(CreatePayrecordComponent, {
      width: '1000px',
      data: { viewId: value.Id },
    }); 
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result == "1") this.getData();
    });
  }

  editReturncord(value: any) {
    this.setViewId(value.Id);
    const dialogRef = this.dialog.originalOpen(CreateReturncordComponent, {
      width: '1200px',
      data: { viewId: value.Id },  
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result == "1") this.getData();
    });
  }
  editRequest(value: any) {
    this.setViewId(value.Id);
    const dialogRef = this.dialog.originalOpen(CreateRequestComponent, {
      width: '1200px',
      data: { viewId: value.Id },  
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result == "1") this.getData();
    });
  }

  viewList(value: any) { 
    this.setViewId(value.Id);
    const dialogRef = this.dialog.originalOpen(CreateViewListComponent, {
      width: '1000px',
      data: { viewId: value.Id },
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result == "1") this.getData();
    });
  }
  AddList(value: any) { 
    this.setViewId(value.Id);
    const dialogRef = this.dialog.originalOpen(CreateAddinformationComponent, {
      width: '1200px',
      data: { viewId: value.Id },
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result == "1") this.getData();
    });
  }
  ViewAll(value: any) { 
    this.setViewId(value.Id);
    const dialogRef = this.dialog.originalOpen(CreateShowAllComponent, {
      width: '1000px',
      data: { viewId: value.Id },
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result == "1") this.getData();
    });
  }
  Viewdocofrequest(value: any) {
    debugger;
    this.setViewId(value);
    const dialogRef = this.dialog.originalOpen(CreateDocofrequestComponent, {
      width: '1000px',
      data: { viewId: value.Id },
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result == "1") this.getData();
    });
  }
  getNodeErrorDateTimeStart($ErrorDateTimeStart) {
    var ErrorDateTimeStarte = this.datepipe.transform($ErrorDateTimeStart, 'yyyy-MM-dd HH:mm:ss');
    this.query.DateAddStart = ErrorDateTimeStarte

    this.getData();
    this.cdr.detectChanges();

  }
  getNodeErrorDateTimeEnd($ErrorDateTimeEnd) {

    var ErrorDateTimeEnde = this.datepipe.transform($ErrorDateTimeEnd, 'yyyy-MM-dd HH:mm:ss');
    this.query.DateAddEnd = ErrorDateTimeEnde

    this.getData();
    this.cdr.detectChanges();
  }
  DeleteRegis() {
    if (this.listReigstration == undefined || this.listReigstration.length <= 0) {
        this.toastr.error(`Vui lòng chọn hồ sơ!`);
        return;
    }
    this.dialog.confirm('Bạn có muốn thu hồi hồ sơ không?', () => {
        var listRegisCheck = [];
        for (var i = 0; i < this.listReigstration.length; i++) {
            var RegisLists = this.listReigstration[i].Id;
            listRegisCheck.push(RegisLists);
        }
        this.borrowmanageService.deleteRegis({ RegisList: listRegisCheck }).subscribe((data: any) => {
            this.toastr.success(`Đã xóa hồ sơ thành công!`);
            this.getData();
        });
    })
}
}
